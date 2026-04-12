import 'dotenv/config';

import { ResumeService } from '../../services/resume.service.js';
import { ResumeModel } from '../../models/resumes.model.js';
import { ModelRegistry } from '../llm/registry.llm.js';
import { ProviderRegistry } from '../providers/registry.provider.js';

const Service = new ResumeService(
    ResumeModel,
    null
);

export class UpdateResumeCollection extends Job {
    
    // cron tab to super determines interval the job runs at
    constructor() { super('0 * * * *'); }

    // defines the series of tasks involved in a ResumeJob
    // each function is a method of the class for testability
    // bind is necessary due to inheritance reference being weird
    
    getTasks() {
        return [
            this._fetchResumes.bind(this),
            this._getGlobalMetas.bind(this),
            this._chunkText.bind(this),
            this._saveResumes.bind(this)
        ];
    }

    async _fetchResumes(ctx) {
        
        // get the resume texts from the remote
        const { resumeTexts, fileMetas } = await Service.getResumesFromRemote(ProviderRegistry.RESUME);
        ctx.resumes = resumeTexts;
        ctx.fileMetas = fileMetas;
    }

    async _chunkText(ctx) {

        // chunk the resumes with LLM
        const chunks = await Service.chunkResumes(ctx.resumes, ModelRegistry.GROQ);
        ctx.chunks = chunks;
    }

    async _getGlobalMetas(ctx) {

        // get globals with LLM
        const metas = await Service.getGlobalMetas(ctx.resumes, ModelRegistry.GROQ);
        ctx.globalMetas = metas;
    }

    async _saveResumes(ctx) {
        
        // save everything to Mongo
        await Service.saveResumesToDatabase(
            ctx.chunks,
            ctx.globalMetas,
            ctx.fileMetas
        );
    }
};