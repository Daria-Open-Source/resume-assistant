import RAG from '../services/orchestration/rag.orchestration.js';

/*
    Controller for the query. 
*/
export const runQuery = async (req, res) => {

    const query = req.query;
    const resumeBuffer = req.buffer;
    const data = await RAG.query(req.query);
};