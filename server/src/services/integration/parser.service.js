import BusBoy from 'busboy';

async function parse(stream, headers) {

    // get parser instance
    const parser = BusBoy({ headers });

    const results = { files: {}, metadata: {} };
    const filePromises = []; // Track file processing to avoid race conditions


    // 1. Handling the PDF Binaries (the 'file' event)
    parser.on('file', (name, file, info) => {
        const chunks = [];
        
        const fileRecievedPromise = new Promise((resolve) => {
            
            // Collect binary buffer pieces
            file.on('data', (chunk) => chunks.push(chunk));
            
            // Combine pieces into one Buffer and store in our variable
            file.on('end', () => { 
                results.files[name] = Buffer.concat(chunks);
                resolve();
            });
        });

        // save the chunk
        filePromises.push(fileRecievedPromise);
    });


    // 2. Handling the Metadata (the 'field' event)
    parser.on('field', (name, val) => {
        
        // try-catch in case metadata isn't json parsable
        try { results.metadata[name] = JSON.parse(val); } 
        catch (e) { results.metadata[name] = val; }

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

export const parseMultiform = async (responseStream, headers) => {
    // We simply wrap the process in a promise to ensure it's awaitable
    return new Promise((resolve, reject) => {
        parse(responseStream, headers)
            .then(resolve)
            .catch(reject);
    });
};