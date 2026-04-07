import 'dotenv/config';
import { getResumesAsBinary } from "../integration/resume.integration.js"
import { ParsingRegistry } from '../parsing/registry.parsing.js';
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
    getTasks() { throw new Error('the child class is not implementing tasks, ensure it does. '); }
};

const Embedder = new MixedBreadEmbeddingModel();
await Embedder.initialize();

const Store = new VectorStore();

export class ResumeJob extends Job {
    constructor(embedder, store) {
        super('0 * * * *');
        this.embedder = embedder;
        this.vectorStore = store;
    }

    // defines the series of tasks involved in a ResumeJob
    // each function is a method of the class for testability
    getTasks() {
        return [
            this._fetchResumes.bind(this),
            this._parseBinaries.bind(this),
            this._chunkText.bind(this),
            this._embedText.bind(this),
            this._saveChunks.bind(this)
        ];
    }

    async _fetchResumes(ctx) {
        
        // fetches resumes from ResumeSource
        const data = await getResumesAsBinary();
        ctx.buffers = Object.values(data.files);
        ctx.fnames = Object.values(data.metadata);
    }

    async _parseBinaries(ctx) {
        
        // wait for promises resolve, then save to ctx
        const textPromises = ctx.buffers.map(buff => ParsingRegistry.getText(buff));
        const texts = await Promise.all(textPromises);
        ctx.texts = texts;
    }

    async _chunkText(ctx) {

        // run text operations with an llm
        const chunkPromises = ctx.texts.map(resume => ParsingRegistry.chunkResume_nowait(resume));
        const metaPromises = ctx.texts.map(resume => ParsingRegistry.getMetadata_nowait(resume));

        // wait for promises to resolve
        const [chunks, meta] = await Promise.all([Promise.all(chunkPromises), Promise.all(metaPromises)]);

        ctx.chunks = chunks;
        ctx.metadata = meta;
    }

    async _embedText(ctx) {

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
    }

    async _saveChunks(ctx) {
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
        const res = await Store.addToStore(dbDocsToWrite, true);
        console.log(res);
    }
};