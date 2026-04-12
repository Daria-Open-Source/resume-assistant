import 'dotenv/config';
import axios from 'axios';
import { TemplateProvider } from './template.provider.js';

import { ParserRegistry } from '../../util/parsers/registry.parsers.js';

export class ResumeProvider extends TemplateProvider {
    constructor() { super(); }
    async get(args) {

        // resume microservice configs
        const url = 'http://localhost:5000';
        const source = 'google';

        // get response as type stream
        const response = await axios.get(`${url}/${source}`, { responseType: 'stream' });
        
        // Pass the stream AND the headers (which contain the boundary)
        if (response.status !== 200) throw new Error(response.data); 
        
        const { files, metadata} = await ParserRegistry.parseResponse(response.data, response.headers);

        // filter oldIds from data
        let newBuffers = [];
        let newMeta = [];
        const oldIds = args.filter;
        for (let i = 0; i < metadata.length; i++) {
            const id = metadata[i].id;

            if (id in oldIds) continue;
            newBuffers.push(files[i]);
            newMeta.push(metadata[i]);
        }

        return { newBuffers, newMeta };
    }
};