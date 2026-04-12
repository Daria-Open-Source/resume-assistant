import * as chunking from './chunking.prompt.js';
import * as metaLocal from './localMetadata.prompt.js';
import * as metaGlobal from './globalMetadata.prompt.js';

export const PromptRegistry = {
    
    'TEXT_EXTRACTION': {
        
        'CHUNKING': {
            'system':   chunking.system,
            'user':     chunking.user
        },

        'LOCAL_METADATA': {
            'system':   metaLocal.system,
            'user':     metaLocal.user
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