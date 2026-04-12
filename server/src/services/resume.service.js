import { PromptRegistry } from '../util/prompts/registry.prompts.js';
import { ResumeModel } from '../models/resumes.model.js';
import { EmbeddingRegistry } from '../infra/embed/registry.embed.js';

export class ResumeService {

    // takes no dependencies at instantiation
    // instead uses dependency injection at runtime
    constructor() {
        this.model = ResumeModel;

        // choose which embedding model you want to use
        // this.embedder = EmbeddingRegistry.HUGGING_FACE;
        this.embedder = EmbeddingRegistry.MIXED_BREAD;
        // this.embedder = EmbeddingRegistry.OLLAMA;
    }

    // @requires:
    // -> ResumeProvider must implement the TemplateProvider interface
    // @returns:
    // -> a string of new resumes not in the database and their file metadata
    async getResumesFromRemote(ResumeProvider) {

        // get the ids of resumes in the db
        const existingResumes = await this.model.find();
        const fingerprints = existingResumes.map(resume => Object.values(resume.sourceId).join('|'));

        // pass the oldIds as a filter to the ResumeSource, get response as buffer
        // see that ResumeService returns this named JSON object
        const { resumeTexts, sourceIds } = await ResumeProvider.get({ 'filter': fingerprints });
        return { resumeTexts, sourceIds };
    }

    // @requires:
    // -> LLM must implement the TemplateLanguageModel interface
    // @throws:
    // -> resumeTexts is not an array
    async getGlobalMetas(resumeTexts, LLM) {

        // guards against non arrays
        if (!Array.isArray(chunkedResumes)
            || !Array.isArray(globalMetas)
            || !Array.isArray(fileMetas)
        ) throw new Error('saveResumesToDatabase expects inputs to be equal-sized arrays');

        // LLM extracts global metas asynchronously
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.GLOBAL_METADATA;
        let metadataPromises = resumeTexts.map(resume => LLM.executePrompt(system(), user({ 'resume': resume})));
        const globalMetas = await Promise.all(metadataPromises);

        return globalMetas;
    }

    // @requires: None
    // @throws:
    // -> resumes/globalMetas/fileMetas are not equally-sized arrays
    async saveResumesToDatabase(chunkedResumes, globalMetas, fileMetas) {
        
        // guards against non arrays
        if (!Array.isArray(chunkedResumes)
            || !Array.isArray(globalMetas)
            || !Array.isArray(fileMetas)
        ) throw new Error('saveResumesToDatabase expects inputs to be equal-sized arrays');

        // guards against unequal array lengths
        if (chunkedResumes.length != globalMetas.length
            || chunkedResumes.length != fileMetas.length
        ) throw new Error('saveResumesToDatabase expects inputs to be equal-sized arrays');

        // collect data from sources into one document
        const docs = chunkedResumes.map((resume, index) => ({
            'chunkedResume': resume,
            'globalMeta': globalMetas[index],
            'sourceId': fileMetas[index]
        }));

        // optimized for multiple documents
        const res = await this.model.insertMany(docs);
        return res;
    }

    async getUnchunked() {

        // get the unchunked resumes
        return await this.model.find({ hasBeenChunked: false });
    }

    // @requires: None
    // @throws:   resumes is not type Array
    async chunkResumes(resumes, LLM) {

        // converts to array so we can use .map
        if (!Array.isArray(resumes)) throw new Error('chunkResumes expects resumes to be an Array of Strings');
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.CHUNKING;

        // make the calls and wait for them to finish
        const chunkPromises = resumes.map(resume => LLM.executePrompt(system(), user({ 'resume': resume })));
        const chunks = await Promise.all(chunkPromises);

        return chunks;
    }

};