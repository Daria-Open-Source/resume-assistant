import express from 'express';

import ResumeProvider from './provider';
import { GoogleDriveSource } from './sources';

const server = express();
const REMOTE_URL = 'http://localhost:3000';

server.get('/google', async (req, res) => {
    
    // initialize the dependency to inject
    const source = GoogleDriveSource();

    // get the resumes from the dependency
    const resumes = await ResumeProvider.getResumesFromSource(source);

    // now send to the remote server
    const didPush = await ResumeProvider.uploadResumesToRemote(REMOTE_URL, resumes);
    
    const status = didPush ? 200 : 400;

    return res.status(status);
});