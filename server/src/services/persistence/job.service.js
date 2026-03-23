/*
    The TemplateJob interface defines several functions for interaction
    -> constructor()    : pass a reference to a driver function associated with the job
    -> runJob()         : executes the driver reference
    -> 
*/
export class Job {

    // takes a driver function for a specfic job to execute
    constructor(cronTab, taskArray) {
        
        // validates each driver
        // this._validateConfig(pipelineConfig);
        
        // this.pipeline = PipeFactory.buildPipeline(pipelineConfig);
        this.tasks = taskArray
        this.cronTab = cronTab;
    }

    _validateConfig(config) {

        // guards on type
        if (typeof config != typeof JSON)
            throw new Error('The config argument is a json');

        // validates key names
        if (!Object.keys(JSON).every(key => key == 'pipename'))
            throw new Error('All config keys must be "pipename"');

    }
    
    async run() { 

        const output = null;

        // feeds output into next task function
        this.tasks.map(async (t) => {
            if (output == null) output = await t();
            else                output = await t(output);
        });

        return output;
    }
}