import express from 'express';

// routers
import ragRouter from './routers/rag.router.js'
import utilRouter from './routers/util.router.js';

const app = express();
app.use('/api/rag', ragRouter);
app.use('/api/util', utilRouter);

export default app;