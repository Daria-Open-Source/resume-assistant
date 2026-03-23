import Scheduler from "./services/integration/scheduler.service"
import { Job } from "./services/persistence/job.service";
import { getResumesAsBinary } from "./services/integration/resume.service";
import { parseBinaryPDF } from "./services/integration/parser.service";

export const scheduleJobs = async () => {

    const resumeTasks = [
        getResumesAsBinary,
        parseBinaryPDF
    ]
    const resumeJob = new Job('0 * * * *', resumeTasks);
    
    const scheduler = new Scheduler([resumeJob]);
    scheduler.scheduleJobs();
};