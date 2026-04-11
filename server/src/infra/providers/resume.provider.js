import 'dotenv/config';
import axios from 'axios';
import { TemplateProvider } from './template.provider.js';

import { ParsingRegistry } from '../../util/parsers/registry.parsers.js';

export class ResumeProvider extends TemplateProvider {
    constructor() { super(); }
    async get() {
        // resume microservice configs
        const url = 'http://localhost:5000';
        const source = 'google';

        // get response as type stream
        const response = await axios.get(`${url}/${source}`, { responseType: 'stream' });
        
        // Pass the stream AND the headers (which contain the boundary)
        if (response.status === 200) return await ParsingRegistry.parseResponse(response.data, response.headers);
        else throw new Error(response.data);
    }
};