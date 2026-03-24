import { pipeline } from '@huggingface/transformers';

/* 
    TemplateEmbeddingModel exposes functions to be called by users
    -> constructor(client)  : This is overridden by child instances to use the child's constructor
    -> initialize()         : Connects to the model server. Must be called before using!!!
    -> embed(documents)     : Expects an array of documents to embed
*/
class TemplateEmbeddingModel {
    constructor(client) { this.client = client; }
    async initialize() {}
    async embed(documents) {
        if (!Array.isArray(documents))
            throw new Error('X_EmbeddingModel.embed expects input of type Array');
        return await this._embedImplementation();
    }
    async _embedImplementation(documents) {}
};

/*
    ChildEmbeddingModel implements specific functions
    -> initialize()             : Defines how the child should connect to its server
    -> _embedImplementation()   : Implements how the embedding process for this model should work
*/
export class HuggingFaceEmbeddingModel extends TemplateEmbeddingModel {

    constructor() { super(null); }
    async initialize() { this.client = await pipeline('feature-extraction', 'Xenova-allMiniLm-L6-v2', {
        auth_token: process.env.HF_TOKEN
    }); }
    async _embedImplementation(documents) {
        return await this.client(documents);
    }
};