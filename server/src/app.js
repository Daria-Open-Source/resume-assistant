import express from 'express';
import cors from 'cors';

// routers
import ragRouter from './routers/rag.router.js'
import utilRouter from './routers/util.router.js';


const app = express();

// middlewares
app.use(cors());

// routes
app.use('/api/rag', ragRouter);
app.use('/api/util', utilRouter);

export default app;