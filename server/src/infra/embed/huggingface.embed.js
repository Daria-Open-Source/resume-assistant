import {TemplateEmbeddingModel} from './template.embed.js';
import { pipeline } from '@huggingface/transformers';

export class HuggingFaceEmbeddingModel extends TemplateEmbeddingModel {

    constructor() { throw new Error('This model is deprecated. Use MixedBreadEmbeddingModel instead'); super(null); }
    async initialize() { this.client = await pipeline('feature-extraction', 'Xenova-allMiniLm-L6-v2', {
        auth_token: process.env.HF_TOKEN
    }); }
    async _embedImplementation(documents) {
        return await this.client(documents);
    }
};