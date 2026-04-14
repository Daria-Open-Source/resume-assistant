import { Scheduler } from './infra/jobs/scheduler.job.js'
import { JobRegistry } from "./infra/jobs/registry.job.js";
import { connectToMongo } from './util/config.util.js';

const connectToDatabase = async () => {
    const dbName = process.env.USE_PROD ? 'prod' : 'dev';
    await connectToMongo(dbName);
};

// starts the job scheduler
const scheduleJobs = () => {

    // Scheduler schedules the Jobs in the jobs array
    const jobs = [
        JobRegistry.updateResumeCollection
    ];
    const scheduler = new Scheduler(jobs);
    scheduler.startJobs();
};

export const setupApp = async () => {
    
    // ensures datbase is good
    await connectToDatabase();
    console.log('connected to mongodb');
    
    // starts background jobs
    // scheduleJobs();
    // console.log('jobs scheduled');
};