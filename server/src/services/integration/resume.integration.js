import 'dotenv/config';
import axios from 'axios';
import { ParsingRegistry } from '../parsing/registry.parsing.js';

export const getResumesAsBinary = async () => {

    console.log('calling remote server');
    // resume microservice configs
    const url = 'http://localhost:5000';
    const source = 'google';

    // get response as type stream
    const response = await axios.get(`${url}/${source}`, { responseType: 'stream' });

    // Pass the stream AND the headers (which contain the boundary)
    if (response.status === 200) return await ParsingRegistry.parseResponse(response.data, response.headers);
};