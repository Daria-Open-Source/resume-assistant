import { ServiceRegistry } from '../services/registry.service.js';
import { ParserRegistry } from '../util/parsers/registry.parsers.js';
import { ModelRegistry } from '../infra/llm/registry.llm.js';

export const runQuery = async (req, res) => {

    // query is the prompt, title is the role they want
    const { username, query } = req.body;

    if (!req.file)
        return res.status(400).json({ 'error': 'no file upload' });

    // we want to mark up or reference info on their pdf in the future
    const buffer = req.file.buffer;
    const resume = await ParserRegistry.getText(buffer);
    const chunkedResume = await ServiceRegistry.RESUME.chunkResumes([resume], ModelRegistry.GROQ);
    const data = await ServiceRegistry.RAG_PIPELINE.queryStore(query, null, ModelRegistry.GROQ, null);

    return res.status(200).json(data);
};