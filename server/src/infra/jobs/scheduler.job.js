import { TemplateJob } from "./template.job";

export class Scheduler {
    constructor(jobsList) {
        this._validateList(jobsList);
        this.jobs = jobsList;
    }
    
    startJobs() {
        console.log('scheduling jobs');
        // schedule every job in the job list
        
        // run jobs with cron
        // this.jobs.map(job => cron.schedule(job.cronTab, async () => await job.runJob()));
    
        // run jobs immediately (when you don't care about testing scheduling)
        this.jobs.forEach(async job => await job.run());
    }

    _validateList(list) {
        
        // array because we run every job in it 
        if (!Array.isArray(list))
            throw new Error('The jobs argument must be type Array');
        
        // function over value for execution over update
        if (!list.every(job => job instanceof TemplateJob))
            throw new Error('Every job must be a Job class item');
    }
};