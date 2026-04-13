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
        return await this.model.insertMany(chunks);
    }

    async embedChunks(chunks) {
        
        // make all the embedding calls
        const embedPromises = chunks.map(chunk => this.embedder.embed(chunk.raw));
        const embeddings = await Promise.all(embedPromises);
        
        // save the embedding in the vec field
        chunks.forEach((chunk, index) => chunk['vec'] = embeddings[index]);
        
        return chunks;
    }

    async getLocalMeta(chunks, LLM) {

        // prompt the LLM and extract metadata for all chunks
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.LOCAL_METADATA;
        
        // pLimit prevents a TooManyRequests error
        const BATCH_SIZE = 3;
        const limit = pLimit(BATCH_SIZE);

        // send controlled promise requests
        const metaPromises = chunks.map(limit(chunk => LLM.executePrompt(system(), user(chunk.raw))));
        const localMetas = await Promise.all(metaPromises);

        // save the metadata as a field in chunk
        chunks.forEach((chunk, index) => chunk['localMeta'] = localMetas[index]);

        return chunks;
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
                resume[section].forEach(raw => {
                    
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