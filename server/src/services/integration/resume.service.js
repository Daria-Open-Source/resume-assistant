import axios from 'axios';
import { parseMultiform } from './parser.service.js';

export const getResumesAsBinary = async () => {

    // resume microservice configs
    const url = 'http://localhost:5000';
    const source = 'google';

    // get response as type stream
    const response = await axios.get(`${url}/${source}`, { responseType: 'stream' });

    // Pass the stream AND the headers (which contain the boundary)
    if (response.status === 200) return await parseMultiform(response.data, response.headers);
};

const results = await getResumesAsBinary();
console.log(results);