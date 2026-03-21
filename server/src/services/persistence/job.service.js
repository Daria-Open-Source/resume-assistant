/*
    The TemplateJob interface defines several functions for interaction
    -> constructor()    : pass a reference to a driver function associated with the job
    -> runJob()         : executes the driver reference
    -> 
*/
class TemplateJob {

    // takes a driver function for a specfic job to execute
    constructor(cronTab, jobRunner, jobParser, jobSaver) {
        
        // validates each driver
        [jobRunner, jobParser, jobSaver].map(fn => this._validateDriver(fn))
        
        this.pipeline = Pipeline(jobRunner, jobParser, jobSaver);
        this.data = null;
    }

    _validateDriver(jobRunner) {
        
        if (typeof jobRunner != typeof Function)
            throw new Error('Job classes take a function to execute a job');
    }
    
    async runJob() { this.data = await this.driver(); }
    async saveJob() {}
}

class Pipe {
    /*
        A pipeline involves three steps:
        1. extracts data from a source (might involve a web request)
        2. parse/clean/transform into a format easy for insertion
        3. saves the data to a collection reference
    */
    constructor(inMethod, outMethod) {

    }

}