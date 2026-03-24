import cron from 'node-cron';
import { Job } from './job.orchestration.js'; 

export class Scheduler {
    constructor(jobsList) {
        this._validateList(jobsList);
        this.jobs = jobsList;
    }
    
    scheduleJobs() {
        // schedule every job in the job list
        this.jobs.map(job => cron.schedule(job.cronTab, async () => await job.runJob()));
    }

    _validateList(list) {
        
        // array because we run every job in it 
        if (!Array.isArray(list)) 
            throw new Error('The jobs argument must be type Array');
        
        // function over value for execution over update
        if (!list.every(job => job instanceof Job))
            throw new Error('Every job must be a Job class item');
    }
};