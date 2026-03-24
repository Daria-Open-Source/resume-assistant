import { Chunk } from "../persistence/chunk.service"

export class VectorStore {

    constructor() {
        this.model = Chunk;
    }

    // similarity search w/ prefiltering
    async vectorSearch(query, k, filters = null, ranker = null) {}

    // 

}