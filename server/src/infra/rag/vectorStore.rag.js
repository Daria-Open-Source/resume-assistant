/* 
What goes into a Vector Store?
-> Takes chunks of text
-> needs a target database to embed to
-> needs an
*/

export class VectorStore {

    // these are hard-coded dependencies
    // because changing them will involve deleting a lot of existing records
    constructor(Database, Embedder) {
        
        // ensures the right model is provided
        if (!Database.hasVectorIndex)
            throw new Error('Instantiated VectorStore with model that doesn\'t support VectorSearch');

        this.model = Database;
        this.embedder = Embedder;
    }

    // this method calls the embedder and embeds an array of strings
    async _embedChunks(chunks) { return await this.embedder.embed(chunks); }

    async _saveToDatabase(chunks, embeds) {
        
    }

    // entry point for pushing to the store
    async vectorizeAndSave(chunks) {
        const embeds = await this._embedChunks(chunks);
        const res = await this._saveToDatabase(chunks, embeds);
        return res;
    }

    // entry point for querying the store
    async similaritySearch(textQuery, numCandidates, filters) {

        // run vector search, delegating the implementation to the model
        const queryVector = await this.embedder.embed([textQuery]);
        const similar = await this.model.vectorSearch(
            queryVector, 
            numCandidates,
            filters
        );

        return similar;
    }

}