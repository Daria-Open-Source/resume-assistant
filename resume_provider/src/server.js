import express from 'express';

import ResumeProvider from './provider';
import { GoogleDriveSource } from './sources';

const server = express();
const REMOTE_URL = 'http://localhost:3000';

server.get('/google', async (req, res) => {
    
    // initialize the dependency to inject
    const source = new GoogleDriveSource();

    // get the resumes from the dependency
    const resumes = await ResumeProvider.getResumesFromSource(source);

    // now send to the remote server
    const didUpload = await ResumeProvider.uploadResumesToRemote(REMOTE_URL, resumes);
    
    // status is based on if the resumes did upload to the server
    const status = didUpload ? 200 : 400;

    // return the status
    return res.status(status);
});