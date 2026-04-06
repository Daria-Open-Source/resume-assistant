import * as lleonart from './lleonart.prompt.js';
import * as chunking from './chunking.prompt.js';
import * as metadata from './metadata.prompt.js';

export default registry = {
    'TEXT_EXTRACTION': {
        
        'CHUNKING': {
            'system':   chunking.system,
            'user':     chunking.user
        },

        'METADATA': {
            'system:':  metadata.system,
            'user':     metadata.user
        }
    }
};