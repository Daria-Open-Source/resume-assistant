import { ParsingRegistry } from "../services/parsing/registry.parsing.js";

export const runQuery = async (req, res) => {

    // query is the prompt, title is the role they want
    const { username, query } = req.body;

    if (!req.file)
        return res.status(400).json({ 'error': 'no file upload' });


    // we want to mark up or reference info on their pdf in the future
    const buffer = req.file.buffer;
    const resume = await ParsingRegistry.getText(buffer);
    const chunkedResume = await ParsingRegistry.chunkResume(resume);
    const data = await doQuery(query, chunkedResume);

    return res.status(200).json(data);
};