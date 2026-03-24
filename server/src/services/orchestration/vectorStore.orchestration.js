import { ChunkService } from "../persistence/models.persistence.js";

export class VectorStore {

    constructor() { this.chunks = new ChunkService(); }

    // similarity search w/ prefiltering
    async vectorSearch(query, k, filters = null, ranker = null) {}

    // chunk embedding
    async addToStore(data) {}
}