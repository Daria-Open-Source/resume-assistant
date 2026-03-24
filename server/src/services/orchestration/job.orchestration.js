import 'dotenv/config';
import { getResumesAsBinary } from "../integration/resume.integration.js"
import { chunkResumes, parseBinaryPDFs } from '../utility/parser.utility.js';
import { MixedBreadEmbeddingModel } from '../integration/embedding.integration.js';
import { VectorStore } from '../persistence/vectorStore.persistence.js';


// const Embedder = new MixedBreadEmbeddingModel();
//const Store = new VectorStore();

// await Embedder.initialize();
/*
    The TemplateJob interface defines several functions for interaction
    -> constructor()    : pass a reference to a driver function associated with the job
    -> runJob()         : executes the driver reference
    -> 
*/

const Embedder = new MixedBreadEmbeddingModel();
await Embedder.initialize();


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

        // 1. Fetching Data
        jobs.push(async ctx => {
            const data = await getResumesAsBinary();
            ctx.buffers = Object.values(data.files);
            ctx.fnames = Object.values(data.metadata);
        });

        // 2. Parsing (No return needed!)
        jobs.push(async ctx => ctx.texts = await parseBinaryPDFs(ctx.buffers));

        // 3. Chunking
        jobs.push(async ctx => {
            const [chunks, fields] = await chunkResumes(ctx.texts);
            ctx.chunks = chunks;
            ctx.fields = fields;
        });
        
        // 4. Embedding
        jobs.push(async ctx => ctx.embeddings = await Embedder.embed(ctx.texts));
        
        // now we have a json of arrays, where each key is a feature
        // store it in resumes

        // add a vec field to each chunk that represents the chunk embedding
        super(tab, jobs);
    }
};