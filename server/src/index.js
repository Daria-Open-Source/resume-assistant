import 'dotenv/config';
import app from './app.js';
import { scheduleJobs } from './config.js';

scheduleJobs();
app.listen(3000, () => console.log('check status on /api/util/health'));