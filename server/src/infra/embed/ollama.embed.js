import { Ollama } from 'ollama';
import { TemplateEmbeddingModel } from './template.embed.js';

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