import 'dotenv/config';
import { getResumesAsBinary } from "../integration/resume.integration.js"
import { ParsingRegistry } from '../parsing/registry.parsing.js';
import { BG3EmbeddingModel, MixedBreadEmbeddingModel } from '../integration/embedding.integration.js';
import { VectorStore } from '../persistence/vectorStore.persistence.js';
import { text } from 'express';


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

const Embedder = new BG3EmbeddingModel();
await Embedder.initialize();

const Store = new VectorStore();

export class ResumeJob extends Job {
    constructor() {

        // a job consists of executing a series of tasks
        // this is modeled with an array of functions
        let tasks = [];
        let tab = '0 * * * *';

        // 1. Fetching Data
        tasks.push(async ctx => {
            const data = await getResumesAsBinary();
            ctx.buffers = Object.values(data.files);
            ctx.fnames = Object.values(data.metadata);
        });

        // 2. Parse Binary into text
        tasks.push(async ctx => {

            // wait for promises resolve, then save to ctx
            const textPromises = ctx.buffers.map(buff => ParsingRegistry.getText(buff));
            const texts = await Promise.all(textPromises);
            ctx.texts = texts;
        });

        // 3. Chunking
        tasks.push(async ctx => {

            // run text operations with an llm
            const chunkPromises = ctx.texts.map(resume => ParsingRegistry.chunkResume(resume));
            const metaPromises = ctx.texts.map(resume => ParsingRegistry.getMetadata(resume));

            // wait for promises to resolve
            const [chunks, meta] = await Promise.all([Promise.all(chunkPromises), Promise.all(metaPromises)]);

            ctx.chunks = chunks;
            ctx.metadata = meta;
        });
        
        // 4. Embedding
        tasks.push(async ctx => {
            
            // Plan:
            // -> embed all the chunk texts at once
            // -> for each chunk, construct a mapping for chunk key to embedding vector
            // -> read from embeds with global cursor, saving mapping to the embeddings array


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
        });
        
        // now we have a json of arrays, where each key is a feature
        // store it in resumes
        tasks.push(async (ctx) => {

            let dbDocsToWrite = [];
            for (let i = 0; i < ctx.fnames.length; i++) {
                
                // i tracks individual resume samples
                // this gets the associated info for a resume
                const vecDict = ctx.embeddings[i];
                const rawDict = ctx.chunks[i];
                const meta = ctx.metadata[i];

                // insert each chunk doc with that resume's specific metadata
                let baseDoc = {
                    'major': meta.major,
                    'year': meta.class,
                    'roles': meta.roles
                };

                // iterate over chunk data specific to a resume
                const vecs = Object.values(vecDict);
                const raws = Object.values(rawDict);
                const secs = Object.keys(rawDict);
                
                // each resume (i) has chunks (j)                
                for (let j = 0; j < secs.length; j++) {
                    
                    // represents the complete doc
                    const dbDoc = {
                        ...baseDoc,
                        'vec': vecs[j],
                        'raw': raws[j],
                        'section': secs[j]
                    };

                    // save to array > save to db FOR NOW
                    // collect all into array then write once
                    dbDocsToWrite.push(dbDoc); 
                }
            }

            // do a bulk write here

            //REMEMBER TO UNCOMMENT THIS FOR TESTING
            const res = await Store.addToStore(dbDocsToWrite, true);
            console.log(dbDocsToWrite);
        });

        // add a vec field to each chunk that represents the chunk embedding
        super(tab, tasks);
    }
};