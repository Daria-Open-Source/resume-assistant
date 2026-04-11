import 'dotenv/config';
import { ParsingRegistry } from '../../util/parsers/registry.parsers.js";
import { VectorStore } from '../../services/vectorStore.persistence.js';

const Store = new VectorStore();

export class ResumeJob extends Job {
    constructor() { super('0 * * * *'); }

    // defines the series of tasks involved in a ResumeJob
    // each function is a method of the class for testability
    // bind is necessary due to inheritance reference being weird
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
        const data  = await getResumesAsBinary();
        ctx.buffers = Object.values(data.files);
        ctx.fnames  = Object.values(data.metadata);
    }

    async _parseBinaries(ctx) {
        
        // wait for promises resolve, then save to ctx
        const textPromises = ctx.buffers.map(buff => ParsingRegistry.getText(buff));
        const texts = await Promise.all(textPromises);
        ctx.texts = texts;
    }

    async _chunkText(ctx) {

        // run text operations with an llm
        const chunkPromises      = ctx.texts.map(resume => ParsingRegistry.chunkResume_nowait(resume));
        const globalMetaPromises = ctx.texts.map(resume => ParsingRegistry.getGlobalMetadata_nowait(resume));

        // wait for promises to resolve
        const [chunks, global] = await Promise.all([Promise.all(chunkPromises), Promise.all(globalMetaPromises)]);

        ctx.chunks     = chunks;
        ctx.globalMeta = global;
    }

    async _embedText(ctx) {
        ctx.embeddings = [];
        
        // for each chunk: embed the section texts, save the texts to the section key, then push the mapping 
        const chunkPromises = ctx.chunks.map(async doc => {
            
            let embeds = {};
            const sections = Object.keys(doc);

            // for each doc section, embed the chunks associated with it and save in embeds[section]
            const embedPromises = sections.map(async section => embeds[section] = await Embedder.embed(doc[section]));
            await Promise.all(embedPromises);

            // save the embed results to the array
            ctx.embeddings.push(embeds);
        });

        await Promise.all(chunkPromises);
    }

    async _saveChunks(ctx) {
        let dbDocsToWrite = [];
        for (let i = 0; i < ctx.fnames.length; i++) {
            
            // i tracks individual resume samples
            // this gets the associated info for a resume
            const vecDict = ctx.embeddings[i];
            const rawDict = ctx.chunks[i];
            const meta    = ctx.globalMeta[i];

            // insert each chunk doc with that resume's global metadata
            let baseDoc = {

                // embeds the global meta associated with this resume
                // into every chunk associated with the resume
                // at the chunk level, we'll add a 'localMeta' dict with a similar purpose
                'globalMeta': {    
                    'major':    meta.major,
                    'roles':    meta.roles,
                    'year':     meta.class
                }
            };

            // iterate over sections in a resume
            const sections = Object.keys(rawDict);
            for (const section of sections) {

                // gets raw, vec pairs that define chunks in a section
                const raws = rawDict[section];
                const vecs = vecDict[section];

                // iterate over them, should have equal lengths
                for (let j = 0; j < raws.length; j++) {
                        
                    // represents the complete doc
                    const dbDoc = {
                        ...baseDoc,
                        'vec':      vecs[j],
                        'raw':      raws[j],
                        'section':  section
                    };

                    // collect all into array then write once
                    dbDocsToWrite.push(dbDoc);
                }
            }
        }

        // do a bulk write here
        const res = await Store.addToStore(dbDocsToWrite, true);
        console.log(res);
    }
};