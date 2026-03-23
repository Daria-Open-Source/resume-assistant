import BusBoy from 'busboy';
import { PDFDocument } from 'pdf-lib';
import { PDFParse } from 'pdf-parse';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// **************************************   //
// LOGIC FOR PARSING RESUME_PROVIDER DATA   //
// **************************************   // 
async function multiform(stream, headers) {

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
        multiform(responseStream, headers)
            .then(resolve)
            .catch(reject);
    });
};


// *************************************    //
// LOGIC FOR PARSING BUFFERS TO PDF/TEXT    //
// *************************************    //

const binaryToText = async (buffer) => {
    
    // note: uses a different library for text extraction
    const parser = new PDFParse({ data: buffer });
    const page = await parser.getText();
    return page.text;
};

// use this in the future for editing the pdf
const binaryToPDF = async (buffer) => {
    const pdf = new PDFDocument.load(buffer);
};

export const parseBinaryPDFs = async (resumeBuffers) => {
    
    let parsed = [];
    for (const buffer of resumeBuffers) {
        
        // run parsing functions
        const text = await binaryToText(buffer);   
        
        // store data as json in array
        parsed.push({ text });
    }

    return parsed;
}



// **************************************   //
// LOGIC FOR PARSING RESUME TEXT SECTIONS   //
// **************************************   //

const callGroq = async (prompt) => {
    
    // tweak these params + prompt for better extraction
    const response = await groq.chat.completions.create({
        messages: [{
            role: "user",
            content: prompt
            }],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    });
    
    // bruh why ts buried :sob:
    return response.choices[0].message.content;
};

const splitResumeWithLLM = async (resume) => {

    const prompt = `
        You are given the raw text of a resume. 
        Identify major section headers (like Education, Skills, Projects, and Experience) and return a JSON mapping of header to its associated text
        Resume text: \n${resume}
    `;

    const text = await callGroq(prompt);
    const json = JSON.parse(text);
    return json;
};

export const splitResumes = async (resumes) => {
    
    const split = [];
    for (const text of resumes) {
        const mapping = await splitResumeWithLLM(text);
        split.push(mapping);
    }

    return split;
}