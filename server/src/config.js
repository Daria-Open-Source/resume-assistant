import mongoose from 'mongoose';

import { Scheduler} from "./services/orchestration/scheduler.orchestration.js"
import { ResumeJob } from "./services/orchestration/job.orchestration.js";

// connects the mongoose schemas to the mongo database
const dbName = 'prod'; // process.env.USE_PROD ? 'prod' : 'dev'; 
const connectToMongo = async () => await mongoose.connect(process.env.DARIA_DB_USER, { dbName });

// starts the job scheduler
const scheduleJobs = () => {

    // Scheduler schedules the Jobs in the jobs array
    const jobs = [new ResumeJob()];
    const scheduler = new Scheduler(jobs);
    scheduler.scheduleJobs();
};

export const setupApp = async () => {
    await connectToMongo();
    console.log('connected to mongodb');
    // scheduleJobs();
    // console.log('jobs scheduled');
};