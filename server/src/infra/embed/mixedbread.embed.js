import axios from 'axios';

import { TemplateEmbeddingModel } from "./template.embed.js";

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