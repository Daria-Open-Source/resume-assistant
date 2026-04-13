import { PromptRegistry } from "../util/prompts/registry.prompts.js";
import { ChunkModel } from "../models/chunks.model.js";
import pLimit from 'p-limit'; 

export class ChunkService {
    
    constructor(Embedder) {
        this.model = ChunkModel;
        this.embedder = Embedder;
        this.hasVectorIndex = true;
    }

    async saveChunks(chunks) {
        const docs = chunks.map(c => new this.model(c));
        return await this.model.insertMany(docs, { runValidators: true });
    }

    async embedChunks(chunks) {
        
        // collect all texts and embed in one call
        const raws = chunks.map(chunk => chunk.raw);
        const vecs = await this.embedder.embed(raws);
        return vecs;
    }

    async getLocalMeta(chunks, LLM) {

        // prompt the LLM and extract metadata for all chunks
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.LOCAL_METADATA;
        
        /*
        // static implementation
        let localMetas = [];
        for (let i = 0; i < chunks.length; i++) {
            const section = chunks[i].section;
            const text = chunks[i].raw;
            const meta = await LLM.executePrompt(system({ section }), user({ text, section }));
            localMetas.push(meta);
        }
        */

        // pLimit prevents a RateLimitExceeded error
        // so far, 1 is the highest before being rate-limited
        const BATCH_SIZE = 1;
        const limit = pLimit(BATCH_SIZE);

        // call the controlled promise and await the results
        const metaPromises = chunks.map(chunk => 
            limit(
                () => LLM.executePrompt(system({ 'section': chunk.section }), user({ 'text': chunk.raw, 'section': chunk.section }))
            )
        );
        let localMetas = await Promise.all(metaPromises);
        
        // SHOULD BE DONE IN MONGOOSE GET THIS OUT OF MY DOMAIN LAYER GRRRRRR
        localMetas.forEach((meta, index) => meta['__t'] = chunks[index].section);
        return localMetas;
    }

    async makeChunksFromResumes(resumes) {

        let chunks = [];

        // iterate over each resume
        // iterate over each resume
        resumes.forEach(resume => {
            
            const globalMeta = resume.globalMeta;
            const resumeId = resume._id;
            const sections = Object.keys(resume.chunkedResume);
            
            sections.forEach(section => {
                resume.chunkedResume[section].forEach(raw => {
                    
                    chunks.push({
                        raw,
                        section,
                        globalMeta,
                        resumeId
                    });
                });
            });
        });

        // return the array at the end
        return chunks;
    }

    async vectorSearch(query, k, filters = null) {

        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector-search",
                    path: "vec",
                    queryVector: query,
                    numCandidates: k * 10,
                    limit: k,
                    filter: filters
                }
            },
            {
                $project: {
                    raw: 1,
                    vec: 1,
                    score: { $meta: "vectorSearchScore" }
                }
            }
        ];

        let results = await this.model.aggregate(pipeline);
        return results;
    } 
};