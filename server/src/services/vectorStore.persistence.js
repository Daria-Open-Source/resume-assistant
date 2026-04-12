import { ChunkService } from "./models.persistence.js";

export class VectorStore extends ChunkService {

    // initializes the model reference in this.model
    constructor() { super(); }

    // similarity search w/ prefiltering
    

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