import { ServiceRegistry } from '../../services/registry.service.js';
import { ModelRegistry } from '../llm/registry.llm.js';
import { TemplateJob } from './template.job.js';

const Resumes = ServiceRegistry.RESUME;
const Chunks = ServiceRegistry.CHUNK;

export class UpdateChunksCollection extends TemplateJob {
    
    // cron tab to super determines interval the job runs at
    constructor() { super('0 * * * *'); }

    // defines the series of tasks involved in a ResumeJob
    // each function is a method of the class for testability
    // bind is necessary due to inheritance reference being weird
    
    getTasks() {
        return [
            this._getResumes.bind(this),
            this._makeChunksFromResumes.bind(this),
            this._getLocalMetas.bind(this),
            this._embedChunks.bind(this),
            this._saveChunks.bind(this),
            this._updateResumeCollection.bind(this)
        ];
    }

    async _getResumes(ctx) {
        
        // get resumes that arent in chunks
        ctx.resumes = await Resumes.getUnchunked();
    }

    async _makeChunksFromResumes(ctx) {

        // turn the resumes into chunks
        const resumes = ctx.resumes;
        const chunks = await Chunks.makeChunksFromResumes(resumes);
        ctx.chunks = chunks;
    }

    async _getLocalMetas(ctx) {

        // chunk the resumes with LLM
        const chunks = ctx.chunks;
        const metas = await Chunks.getLocalMeta(chunks, ModelRegistry.GROQ);
        ctx.localMetas = metas;
    }

    async _embedChunks(ctx) {
        
        // vectorize chunk raws
        const chunks = ctx.chunks
        const vecs = await Chunks.embedChunks(chunks);
        ctx.vecs = vecs;
    }

    async _saveChunks(ctx) {
        
        // build the document
        let chunks = ctx.chunks;
        chunks.forEach((chunk, index) => {
            chunk.localMeta = ctx.localMetas[index];
            chunk.vec = ctx.vecs[i];
        });

        // save everything to Mongo
        await Chunks.saveChunks(chunks);
    }

    async _updateResumeCollection(ctx) {
        const resumes = ctx.resumes;
        const ids = resumes.map(r => r._id);
        await Resumes.markResumesAsChunked(ids);
    }
};