import { PDFParse } from 'pdf-parse';

// *************************************    //
// LOGIC FOR PARSING BUFFERS TO PDF/TEXT    //
// *************************************    //

export const binaryToText = async (buffer) => {
    
    // note: uses a different library for text extraction
    const parser = new PDFParse({ data: buffer });
    const page = await parser.getText();
    return page.text;
};