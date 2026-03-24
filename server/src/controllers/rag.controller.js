import { doQuery } from "../services/orchestration/rag.orchestration.js";

/*
    Controller for the query. 
*/
export const runQuery = async (req, res) => {

    console.log('reached controller');

    // query is the prompt, title is the role they want
    const { username, query } = req.body;

    if (!req.file)
        return res.status(400).json({ 'error': 'no file upload' });

    console.log(`got request from ${username}`);


    // we want to mark up or reference info on their pdf in the future
    const buffer = req.file.buffer;
    const fileName = req.file.originalname;

    const data = await doQuery(query);

    return res.status(200).json(data);
};