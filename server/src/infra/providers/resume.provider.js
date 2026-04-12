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
        
        const data = await ParserRegistry.parseResponse(response.data, response.headers);
        const { files, metadata } = data;

        // filter oldIds from data
        let buffers = [];
        let fileMetas = [];
        const existingFingerprints = args.filter;
        for (let i = 0; i < metadata.length; i++) {

            const fingerprint = `${source}|${metadata[i].id}`;

            // filter existing ids
            if (existingFingerprints.includes(fingerprint)) continue;
            buffers.push(files[i]);
            
            // change schema to match mongoose
            metadata[i]['source'] = source;
            metadata[i]['value'] = metadata[i]['id']
            
            // delete unnecessary keys
            delete metadata[i]['name']; 
            delete metadata[i]['id'];
            
            // save to array
            fileMetas.push(metadata[i]);
        }

        return { buffers, fileMetas };
    }
};