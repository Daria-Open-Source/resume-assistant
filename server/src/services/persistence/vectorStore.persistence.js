import { ChunkService } from "./models.persistence.js";

export class VectorStore extends ChunkService {

    // initializes the model reference in this.model
    constructor() { super(); }

    // similarity search w/ prefiltering
    async vectorSearch(query, k, filters = null, ranker = null) {

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
                    score: { $meta: "vectorSearchScore" } // Captures the similarity score
                }
            }
        ];

        // If a ranker (like a Reranker) is provided, you might want to fetch 
        // more candidates than k, then sort them in your application logic.
        let results = await this.model.aggregate(pipeline);

        if (ranker) {
            // Example: ranker.rerank(queryVector, results)
            results = await ranker(queryVector, results);
        }

        return results;
    }

    // chunk embedding
    async addToStore(data, useBulkWrite = false) { 
        return await super.insert(data, useBulkWrite);
    }

    // disable these methods
    async find() { throw new Error('VectorStore class only supports VectorStore.vectorSearch and VectorStore.addToStore'); }
    async findOneById() { throw new Error('VectorStore class only supports VectorStore.vectorSearch and VectorStore.addToStore'); }
    async insert() { throw new Error('VectorStore class only supports VectorStore.vectorSearch and VectorStore.addToStore'); }
    async updateOneById() { throw new Error('VectorStore class only supports VectorStore.vectorSearch and VectorStore.addToStore'); }
    async deleteOneById() { throw new Error('VectorStore class only supports VectorStore.vectorSearch and VectorStore.addToStore'); }
};