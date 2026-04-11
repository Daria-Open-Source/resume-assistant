export class Job {

    // cronTab dictates how often the job runs
    constructor(cronTab) { this.cronTab = cronTab; }
    
    async run() { 

        let context = {};

        // the context is passed by reference to each task
        // it maintains a shared state between tasks
        for (const t of this.getTasks()) await t(context);
        return context;
    }

    // entrypoint for defining tasks in the task array
    getTasks() { throw new Error('the child class is not implementing tasks, ensure it does.'); }
};