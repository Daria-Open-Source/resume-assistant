import { ChunkModel } from '../models/chunks.model.js';
import { VectorStore } from '../infra/rag/vectorStore.rag.js';
import { PromptRegistry } from '../util/prompts/registry.prompts.js';
import { EmbeddingRegistry } from '../infra/embed/registry.embed.js';

export class ResumeRagService {

    constructor() {

        // store interfaces other dependencies
        this.store = new VectorStore(
            new ChunkService(),
            EmbeddingRegistry.MIXED_BREAD
        );
    }

    async queryStore(textQuery, filters, LLM, RankingAlgorithm) {
        
        // hard-coded limits for results
        const NUM_SIMILAR = 25;
        const NUM_BEST    = 5;

        // get the most similar results
        const similarResults = await VectorStore.similaritySearch(
            textQuery,
            NUM_SIMILAR,
            filters
        );

        // rank and take the top something
        const bestResults = await RankingAlgorithm.rank(
            similarResults,
            NUM_BEST
        );

        // prompt model and get response
        const { system, user } = PromptRegistry.RAG.GENERATE;
        const textResponse = await LLM.executePrompt(
            system(),
            user({ 'input': textQuery, 'documents': bestResults })
        );

        return textResponse;
    }

    async insertToStore(chunks, globalMetas, localMetas) {
        
        // embed chunk texts
        const embedPromises = chunks.map(chunk => this.embedder.embed(chunk.raw));
        const embeddings = await Promise.all(embedPromises);

        // add each chunk's embedding to its document model
        documents = [];
        chunks.forEach((chunk, index) => {
            
            // save a document in the array
            documents.push({
                'raw': chunk.raw,
                'vec': embeddings[index],
                'section': chunk.section,
                'resumeId': chunk.resumeId,
                'localMeta': localMetas[index],
                'globalMeta': globalMetas[index],
            });
        });

        const res = await this.model.insertMany(documents);
    }
}