import { Router } from "express";
import { parseClientMultiform } from "../middlewares/parsing.middleware.js";
import { runQuery } from "../controllers/rag.controller.js";

const ragRouter = Router();
ragRouter.post('/query', parseClientMultiform, runQuery);

export default ragRouter;