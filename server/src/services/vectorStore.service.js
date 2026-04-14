import { ModelRegistry } from '../infra/llm/registry.llm.js';

export class ResumeVectorStore {

    constructor(DataService) { 
        
        if (!DataService.hasVectorIndex) throw new Error('ResumeVectorStore requires a Data Service dependency that supports Vector Search');
        this.service = DataService; }

    // entry point for pushing to the store
    async pushResumes(resumes) {

        // these functions will mutate chunks into a schema-compliant mongo document
        const chunks = await this.service.makeChunksFromResumes(resumes);
        const chunksWithMeta = await this.service.getLocalMeta(chunks, ModelRegistry.GROQ);
        const chunksWithVecs = await this.service.embedChunks(chunksWithMeta);
        return await this.service.saveChunks(chunksWithVecs);
    }

    // entry point for querying the store
    async similaritySearch(textQuery, numCandidates, filters) {

        // run vector search, delegating the implementation to the model
        const queryVector = await this.service.embedder.embed([textQuery]);
        const similar = await this.service.vectorSearch(
            queryVector[0], 
            numCandidates,
            filters
        );

        return similar;
    }
}