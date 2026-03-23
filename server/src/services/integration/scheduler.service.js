import cron from 'node-cron';
import { Job } from '../persistence/job.service.js';

export default class Scheduler {
    constructor(jobsList) {
        validateList(jobsList);
        this.jobs = jobsList;
    }
    
    scheduleJobs() {
        // schedule every job in the job list
        this.jobs.map(job => cron.schedule(job.cronTab, async () => await job.run()));
    }

    _validateList(list) {
        
        // array because we run every job in it 
        if (typeof list != typeof Array) 
            throw new Error('The jobs argument must be type Array');
        
        // function over value for execution over update
        if (!list.every(job => (typeof job == typeof Job)))
            throw new Error('Every job must be a Job class item');
    }
};