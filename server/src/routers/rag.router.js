import { Router } from "express";

const ragRouter = Router();
ragRouter.post('/query', (req, res) => res.status(500).json({ 'error': 'not implemented' }));

export default ragRouter;