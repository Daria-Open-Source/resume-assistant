import express from 'express';
import FormData from 'form-data';

import ResumeProvider from './provider.js';
import { GoogleDriveSource } from './sources.js';

const server = express();

server.get('/google', async (req, res) => {
    
    // initialize the dependency to inject
    const source = new GoogleDriveSource();

    // get data
    const { binaries, metadata } = await ResumeProvider.getResumesFromSource(source);
    console.log(binaries);
    console.log(metadata);
    
    // data will be sent as multiform response
    const form = new FormData();
    
    // add each pdf
    binaries.forEach((binary, index) => form.append(
        `resume_${index + 1}`, binary, 
        {
            filename: metadata[index].name,
            contentType: 'application/pdf',
            knownLength: binary.length
        })
    );

    // add each metadata tag
    metadata.forEach((tag, index) => form.append(`tag_${index + 1}`, JSON.stringify(tag)));

    // return the data as a multipart form object
    res.setHeader('Content-Type', `multipart/form-data; boundary=${form.getBoundary()}`);
    form.pipe(res);
});

export default server;