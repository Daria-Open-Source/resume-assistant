import { doQuery } from "../services/orchestration/rag.orchestration.js";
import { parseBinaryPDFs, chunkResumes } from '../services/utility/parser.utility.js';
/*
    Controller for the query. 
*/
export const runQuery = async (req, res) => {

    // query is the prompt, title is the role they want
    const { username, query } = req.body;

    if (!req.file)
        return res.status(400).json({ 'error': 'no file upload' });

    console.log(`got request from ${username}`);


    // we want to mark up or reference info on their pdf in the future
    const buffer = req.file.buffer;
    console.log(buffer);

    const text = await parseBinaryPDFs([buffer]);
    const chunkedResume = await chunkResumes([text]);
    const chunks = chunkedResume[0][0];

    const data = await doQuery(query, chunks);

    return res.status(200).json(data);
};