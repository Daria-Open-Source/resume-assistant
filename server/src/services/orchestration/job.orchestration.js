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

        let context = {};

        // context is passed by reference to each task
        for (const t of this.tasks) await t(context);
        return context;
    }
};

const Embedder = new MixedBreadEmbeddingModel();
await Embedder.initialize();

const Store = new VectorStore();

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
            const [chunks, meta] = await chunkResumes(ctx.texts);
            ctx.chunks = chunks;
            ctx.metadata = meta;
        });
        
        // 4. Embedding
        jobs.push(async ctx => {
            
            ctx.embeddings = [];

            // get all chunk texts and embed with one api call
            // use cursor to iterate over indices in embeds
            let allChunkTexts = ctx.chunks.flatMap(chunk => Object.values(chunk));
            const embeds = await Embedder.embed(allChunkTexts);
            let cursor = 0;

            // for each chunk, build an embedding map to add to ctx.embeddings
            ctx.chunks.forEach(chunk => {
                let embedMap = {};

                // loop over sections in a chunk, mapping that text embedding to a section name
                Object.keys(chunk).forEach(section => {
                    embedMap[section] = embeds[cursor];
                    cursor++;
                });

                // after iterating over a chunk, push it to the ctx.embeddings array
                ctx.embeddings.push(embedMap);
            });

            console.log(ctx);
        });
        
        // now we have a json of arrays, where each key is a feature
        // store it in resumes
        jobs.push(async (ctx) => {

            let dbDocsToWrite = [];
            for (let i = 0; i < ctx.fnames.length; i++) {
                
                const vecDict = ctx.embeddings[i];
                const rawDict = ctx.chunks[i];
                const meta = ctx.metadata[i];
                // const meta = ctx.metadata[i];
                let baseDoc = {
                    'major': meta.major,
                    'year': meta.class,
                    'roles': meta.roles
                };

                // iterate over these
                const vecs = Object.values(vecDict);
                const raws = Object.values(rawDict);
                const secs = Object.keys(rawDict);
                for (let j = 0; j < secs.length; j++) {
                    
                    const dbDoc = {
                        ...baseDoc,
                        'vec': vecs[j],
                        'raw': raws[j],
                        'section': secs[j]
                    };
                    dbDocsToWrite.push(dbDoc); 
                }
            }

            // do a bulk write here
            const res = await Store.addToStore(dbDocsToWrite, true);
            console.log(res);
        });

        // add a vec field to each chunk that represents the chunk embedding
        super(tab, jobs);
    }
};