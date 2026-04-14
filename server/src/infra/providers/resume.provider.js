import axios from 'axios';
import { TemplateProvider } from './template.provider.js';

import { ParserRegistry } from '../../util/parsers/registry.parsers.js';

export class GoogleResumeProvider extends TemplateProvider {
    constructor() { super('google'); }

    async _fetchFromRemote() {
        // resume microservice configs
        const url = 'http://localhost:5000';

        // get response as type stream
        const response = await axios.get(`${url}/${this.source}`, { responseType: 'stream' });
        
        // Pass the stream AND the headers (which contain the boundary)
        if (response.status !== 200) throw new Error(response.data); 
        
        const { files, metadata } = await ParserRegistry.parseResponse(response.data, response.headers);
        return { files, metadata };
    };

    async _filterResults(files, metadata, filter) {
        let buffers = [];       // binaries
        let sourceIds = [];     // method for identifying an item

        const existingFingerprints = filter;
        for (let i = 0; i < metadata.length; i++) {

            const fingerprint = `${this.source}|${metadata[i].id}`;

            // filter existing ids
            if (existingFingerprints.includes(fingerprint)) continue;
            
            // change schema to match mongoose
            metadata[i]['source'] = this.source;
            metadata[i]['value'] = metadata[i]['id']
            
            // delete unnecessary keys
            delete metadata[i]['name']; 
            delete metadata[i]['id'];
            
            // save items to arrays
            sourceIds.push(metadata[i]);
            buffers.push(files[i]);
        }

        return { buffers, sourceIds };
    }

    async _parseBuffers(buffers) {
        const bufferPromises = buffers.map(buffer => ParserRegistry.getText(buffer));
        return await Promise.all(bufferPromises);
    }

    async _getImplementation(args) {
        
        // gets raw content from server 
        const { files, metadata } = await this._fetchFromRemote();
        
        // filters out existing entries
        const { buffers, sourceIds } = await this._filterResults(files, metadata, args.filter);
        
        // parse the binary buffers into strings
        const resumeTexts = await this._parseBuffers(buffers);
        
        // return the result
        return { resumeTexts, sourceIds };
    }
};