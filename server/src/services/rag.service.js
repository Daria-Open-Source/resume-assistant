import { PromptRegistry } from '../util/prompts/registry.prompts.js';

export class ResumeRagService {

    constructor(VectorStore) { this.store = VectorStore; }

    async queryStore(input, LLM, RankingAlgorithm) {
        
        // hard-coded limits for results
        const NUM_SIMILAR = 5;
        // const NUM_BEST    = 5;

        // get the most similar results
        let documents = {};
        const sections = Object.keys(input.chunkedResume);
        const docPromises = sections.map(section => this.store.similaritySearch(input.role, NUM_SIMILAR, { section }));
        const docArray = await Promise.all(docPromises);
        
        // save array data to documents
        sections.forEach((section, index) => documents[section] = docArray[index])
        console.log(input.chunkedResume);
        console.log(documents);
        
        // remove the vector field
        Object.values(documents).forEach(docArray => docArray.forEach(doc => doc.vec = null));

        /*
        // rank and take the top something
        const bestResults = await RankingAlgorithm.rank(
            similarResults,
            NUM_BEST
        );
        */

        // prompt model and get response
        const { system, user } = PromptRegistry.RAG.GENERATE;

        console.log(user({ 'role': input.role, 'query': input.query, 'resume': input.chunkedResume, documents }));
        const textResponse = await LLM.executePrompt(
            system(),
            user({ 'role': input.role, 'query': input.query, 'resume': input.chunkedResume, documents })
        );

        return textResponse;
    }

    async pushResumesToStore(resumes) { return await this.store.pushResumes(resumes); }
}