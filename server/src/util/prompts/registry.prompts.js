import * as chunking from './chunking.prompt.js';
import * as metadata from './metadata.prompt.js';
import * as metaGlobal from './globalMetadata.prompt.js';

export const PromptRegistry = {
    
    'TEXT_EXTRACTION': {
        
        'CHUNKING': {
            'system':   chunking.system,
            'user':     chunking.user
        },

        'METADATA': {
            'system':   metadata.system,
            'user':     metadata.user
        },

        'GLOBAL_METADATA': {
            'system':   metaGlobal.system,
            'user':     metaGlobal.user
        }
    },

    'RAG': {

        'GENERATE': {
            
        }
    }
};