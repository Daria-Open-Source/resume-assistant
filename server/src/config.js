import mongoose from 'mongoose';

import Scheduler from "./services/integration/scheduler.service.js"
import { ResumeJob } from "./services/persistence/job.service.js";

// connects the mongoose schemas to the mongo database
const connectToMongo = async () => await mongoose.connect(process.env.MONGO_URI);

// starts the job scheduler
const scheduleJobs = () => {

    const jobs = [new ResumeJob()];
    
    const scheduler = new Scheduler(jobs);
    scheduler.scheduleJobs();
};

export const setupApp = async () => {
    await connectToMongo();
    scheduleJobs();
};