import Scheduler from "./services/integration/scheduler.service.js"
import { ResumeJob } from "./services/persistence/job.service.js";


export const scheduleJobs = () => {

    const jobs = [new ResumeJob()];
    
    const scheduler = new Scheduler(jobs);
    scheduler.scheduleJobs();
};