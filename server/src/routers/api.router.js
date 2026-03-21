import { Router } from "express";

const apiRouter = Router();

apiRouter.get('/health', (req, res) => res.json({'status': 'ok'}));
apiRouter.post('/query', (req, res) => res.status(500).json({ 'error': 'not implemented' }));


export default apiRouter;