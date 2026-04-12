import { PromptRegistry } from '../util/prompts/registry.prompts.js';
export class ResumeService {

    // takes no dependencies at instantiation
    // instead uses dependency injection at runtime
    constructor(
        Database,
        Embedder
    ) {
        this.model = Database;
        this.embedder = Embedder;
    }

    // @requires:
    // -> ResumeProvider to provide resumes
    // @returns:
    // -> a string of new resumes not in the database
    async getResumesFromRemote(ResumeProvider) {

        // get the ids of resumes in the db
        const resumes = await this.model.find();
        const oldIds = resumes.map(resume => resume.sourceId.value);
        console.log(oldIds);
        
        // pass the oldIds as a filter to the ResumeSource
        const { newBuffers, newMeta } = await ResumeProvider.get({ 'filter': oldIds });
        return { newBuffers, newMeta };
    }

    async getGlobalMetas(resumeTexts, LLM) {

        // LLM extracts global metas asynchronously
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.GLOBAL_METADATA;
        let metadataPromises = resumeTexts.map(resume => LLM.executePrompt(system(), user(resume)));
        const globalMetas = await Promise.all(metadataPromises);

        return globalMetas;
    }

    // @requires:
    // -> database to be a Mongoose Schema
    // @throws:
    // -> resumes/globalMetas/fileMetas are not equally-sized arrays
    async saveResumesToDatabase(chunkedResumes, globalMetas, fileMetas) {
        
        if (!Array.isArray(chunkedResumes)
            || !Array.isArray(globalMetas)
            || !Array.isArray(fileMetas)
        ) throw new Error('saveResumesToDatabase expects inputs to be equal-sized arrays');

        if (chunkedResumes.length != globalMetas.length
            || chunkedResumes.length != fileMetas.length
        ) throw new Error('saveResumesToDatabase expects inputs to be equal-sized arrays');

        const docs = chunkedResumes.map((resume, index) => ({
            ...resume,
            ...globalMetas[index],
            sourceId: fileMetas[index].id
        }));

        // optimized for multiple documents
        await this.model.insertMany(docs);
    }

    // @requires: None
    // @throws:   resumes is not type Array
    async chunkResumes(resumes, LLM) {

        // converts to array so we can use .map
        if (!Array.isArray(resumes)) throw new Error('chunkResumes expects resumes to be an Array of Strings');
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.CHUNKING;

        // make the calls and wait for them to finish
        const chunkPromises = resumes.map(resume => LLM.executePrompt(system(), user(resume)));
        const chunks = await Promise.all(chunkPromises);

        return chunks;
    }

};