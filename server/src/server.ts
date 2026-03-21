// server/src/server.ts
import { ResumeService } from './resumes/service.ts';

const resumeService = ResumeService.getInstance();
resumeService.startCron();