import 'dotenv/config';
import app from './app.js';
import { ResumeService } from './service.ts';

const resumeService = ResumeService.getInstance();
resumeService.startCron();
app.listen(() => console.log('check status on /api/util/health'));