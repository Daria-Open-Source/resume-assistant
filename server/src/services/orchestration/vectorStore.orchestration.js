import { Chunk } from "../persistence/chunk.persistence"

export class VectorStore {

    constructor() {
        this.model = Chunk;
    }

    // similarity search w/ prefiltering
    async vectorSearch(query, k, filters = null, ranker = null) {}

    // 

}