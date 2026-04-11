import { pipeline } from '@huggingface/transformers';
import axios from 'axios';
import { Ollama } from 'ollama';

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
            throw new Error('EmbeddingModel.embed expects input of type Array');
        return await this._embedImplementation(documents);
    }
    async _embedImplementation(documents) {}
};

/*
    ChildEmbeddingModel implements specific functions
    -> initialize()             : Defines how the child should connect to its server
    -> _embedImplementation()   : Implements how the embedding process for this model should work
*/
export class HuggingFaceEmbeddingModel extends TemplateEmbeddingModel {

    constructor() { throw new Error('This model is deprecated. Use MixedBreadEmbeddingModel instead'); super(null); }
    async initialize() { this.client = await pipeline('feature-extraction', 'Xenova-allMiniLm-L6-v2', {
        auth_token: process.env.HF_TOKEN
    }); }
    async _embedImplementation(documents) {
        return await this.client(documents);
    }
};

export class MixedBreadEmbeddingModel extends TemplateEmbeddingModel {
    constructor() { 
        super(null); 
        this.key = process.env.MIXEDBREAD_API_KEY;
        this.url = 'https://api.mixedbread.com/v1/embeddings';
    }
    
    async initialize() { this.client = axios.post; }
    async _embedImplementation(documents) {

        const response = await this.client(this.url, {
            model: 'mixedbread-ai/mxbai-embed-large-v1',
            input: documents,
            normalized: true,
            encoding_format: 'float'
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.key}`
            },
        });
            
        return response.data.data.map(item => item.embedding);
    }
};


// NOTE: Only Jacob's machine can run the Ollama Embedding Model
export class OllamaEmbeddingModel extends TemplateEmbeddingModel {
    constructor() { 
        super(null); 
        this.key = process.env.MIXEDBREAD_API_KEY;
        this.url = 'https://api.mixedbread.com/v1/embeddings';
    }
    
    async initialize() { this.client = new Ollama({ host: 'http://localhost:11434' }).embed; }
    async _embedImplementation(documents) {

        const vectors = await this.client({
            model: 'nomic-embed-text',
            input: documents
        });
        
        return vectors;
    }

};