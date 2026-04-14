import { PromptRegistry } from '../util/prompts/registry.prompts.js';

export class ResumeRagService {

    constructor(VectorStore) { this.store = VectorStore; }

    async queryStore(input, filters, LLM, RankingAlgorithm) {
        
        // hard-coded limits for results
        const NUM_SIMILAR = 25;
        const NUM_BEST    = 5;

        // get the most similar results
        const similarResults = await this.store.similaritySearch(
            input.role,
            NUM_SIMILAR,
            filters
        );

        /*
        // rank and take the top something
        const bestResults = await RankingAlgorithm.rank(
            similarResults,
            NUM_BEST
        );
        */

        // prompt model and get response
        const { system, user } = PromptRegistry.RAG.GENERATE;
        const textResponse = await LLM.executePrompt(
            system(),
            user({ 'role': input.role, 'query': input.query, 'resume': input.chunkedResume, 'documents': similarResults })
        );

        return textResponse;
    }

    async pushResumesToStore(resumes) { return await this.store.pushResumes(resumes); }
}