import { Router } from "express";
import { parseClientMultiform } from "../middlewares/parsing.middleware.js";
import * as Controller from "../controllers/rag.controller.js";

const ragRouter = Router();
ragRouter.post('/query', parseClientMultiform, Controller.runQuery);

export default ragRouter;