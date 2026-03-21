import { Router } from "express";

const utilRouter = Router();
utilRouter.get('/health', (req, res) => res.json({'status': 'ok'}));

export default utilRouter;