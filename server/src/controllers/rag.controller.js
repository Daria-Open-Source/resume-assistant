import RAG from '../services/orchestration/rag.service.js';

/*
    Controller for the query. 
*/
export const runQuery = async (req, res) => {
    const data = await RAG.query(req.query);
};