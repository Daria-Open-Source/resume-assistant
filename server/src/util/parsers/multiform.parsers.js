import BusBoy from 'busboy';

// **************************************   //
// LOGIC FOR PARSING RESUME_PROVIDER DATA   //
// **************************************   // 
async function multiform(stream, headers) {

    // get parser instance
    const parser = BusBoy({ headers });

    let results = { files: [], metadata: [] };
    let filePromises = []; // Track file processing to avoid race conditions


    // 1. Handling the PDF Binaries (the 'file' event)
    parser.on('file', (name, file, info) => {
        let chunks = [];

        const fileRecievedPromise = new Promise((resolve) => {

            // Collect binary buffer pieces
            file.on('data', (chunk) => chunks.push(chunk));
            
            // Combine pieces into one Buffer and store in our variable
            file.on('end', () => { 
                results.files.push(Buffer.concat(chunks));
                resolve();
            });
        });

        // save the chunk
        filePromises.push(fileRecievedPromise);
    });


    // 2. Handling the Metadata (the 'field' event)
    parser.on('field', (name, val) => {
        
        // try-catch in case metadata isn't json parsable
        try { results.metadata.push(JSON.parse(val)); } 
        catch (e) { results.metadata.push(val); }
    });

    // parse the thing!
    stream.pipe(parser);

    // this makes execution wait for one of the two signals from parser
    await new Promise((resolve, reject) => {
        parser.on('finish', resolve);
        parser.on('error', reject);
    });

    // filePromises doesn't resolve if error occurs
    await Promise.all(filePromises);
    
    return results;
};

export const parseResumeServerMultiform = async (responseStream, headers) => {
    // We simply wrap the process in a promise to ensure it's awaitable
    return new Promise((resolve, reject) => {
        multiform(responseStream, headers)
            .then(resolve)
            .catch(reject);
    });
};