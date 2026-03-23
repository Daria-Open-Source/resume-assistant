import 'dotenv/config';
import { getResumesAsBinary } from "../integration/resume.service.js"
import { parseBinaryPDFs, splitResumes } from '../extraction/parser.service.js';

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
    
    async runJob() { 

        let output = null;

        // wait for each task to finish
        // then feed output into the next
        for (const t of this.tasks) {

            // either initialize output or feed it
            if (output == null) output = await t();
            else                output = await t(output);
        }
        

        return output;
    }
};

export class ResumeJob extends Job {
    constructor() {

        let jobs = [];
        let tab = '0 * * * *';
        let metadata = null;
        let pdfs = null;

        // reads the binary stream from resume_provider
        jobs.push(getResumesAsBinary);

        // middleware that saves file metadata, pushes buffers along
        jobs.push((filesAsBinary) => {
            return Object.values(filesAsBinary.files);
        });

        // turns buffers into jsons of text
        jobs.push(parseBinaryPDFs);

        // saves the json, pushes the raw text array along
        jobs.push((parsedPDFs) => {
            pdfs = parsedPDFs;
            return parsedPDFs.map(pdf => pdf.text);    
        });

        // split the raw text into sections
        jobs.push(splitResumes);

        super(tab, jobs);
    }
};

const resJob = new ResumeJob();
const chunks = await resJob.runJob();
console.log(chunks);