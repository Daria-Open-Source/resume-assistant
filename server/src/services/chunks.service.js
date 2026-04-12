import { PromptRegistry } from "../util/prompts/registry.prompts.js";
import { ChunkModel } from "../models/chunks.model.js";

export class ChunkService {
    
    constructor(Embedder) {
        this.model = ChunkModel;
        this.Embedder = Embedder;
    }

    async embedChunks(chunks) {
        
        // make all the embedding calls
        const embedPromises = chunks.map(chunk => this.Embedder.embed(chunk.raw));
        const embeddings = await Promise.all(embedPromises);
        
        // save the embedding in the vec field
        chunks.forEach((chunk, index) => chunk['vec'] = embeddings[index]);
        
        return chunks
    }

    async getLocalMeta(chunks, LLM) {

        // prompt the LLM and extract metadata for all chunks
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.LOCAL_METADATA;
        const metaPromises = chunks.map(chunk => LLM.executePrompt(system(), user(chunk.raw)));
        const localMetas = await Promise.all(metaPromises);

        // save the metadata as a field in chunk
        chunks.forEach((chunk, index) => chunk['localMeta'] = localMetas[index]);

        return chunks;
    }

    async makeChunks(resumes) {

        let chunks = [];
        resumes.forEach(resume => {
            
            // base chunk
            // this is shared by all chunks from this resume 
            let chunk = {
                'resumeId': resume._id,
                'globalMeta': resume.globalMeta
            };

            const sections = Object.keys(resume.chunkedResume);
            sections.forEach(section => {
                
                // adds the section tag
                // shared by all chunks in this section
                chunk['section'] = section;
                resume[section].forEach(rawChunk => {
                    
                    // push an entry for every raw text chunk
                    chunk['raw'] = rawChunk;
                    chunks.push(chunk);
                });
            });
            
        });

        // return the array at the end
        return chunks;
    }


};