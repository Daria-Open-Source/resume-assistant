import { ResumeService } from './resume.service.js';
import { ChunkService } from './chunks.service.js';
import { ResumeVectorStore } from './vectorStore.service';
import { ResumeRagService } from './rag.service';
import { EmbeddingRegistry } from '../infra/embed/registry.embed.js';

const resume = new ResumeService();
const chunk  = new ChunkService(EmbeddingRegistry);
const store  = new ResumeVectorStore(chunk);
const rag    = new ResumeRagService(store);

export const ServiceRegistry = {
    'RESUME': resume,
    'CHUNK':  chunk,
    'RAG_PIPELINE': rag,
    'VECTOR_STORE': store
};