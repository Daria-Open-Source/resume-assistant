import PromptRegistry from "../prompts/registry.prompts.js";

export class TextExtractor {

    constructor (llm) { this.llm = llm; }

    async chunkResumeText(resumeAsText) {

        // get prompts
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.CHUNKING;

        // returns mapping of sectionName: [stringChunks]
        const response = await this.llm.executePrompt(system, user({ 'resume': resumeAsText }));
        return response;
    }

    async extractResumeMetadata(sectionToChunks) {
        
        // get prompts
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.METADATA;
        
        // returns mapping of sectionName: [stringChunks]
        const response = await this.llm.executePrompt(system, user({ 'chunkedResume': sectionToChunks }));
        return response;
    }

    async extractGlobalMetadata(rawResume) {

        // get prompts
        const { system, user } = PromptRegistry.TEXT_EXTRACTION.GLOBAL_METADATA;

        // returns json of globalMetadata
        const response = await this.llm.executePrompt(system(), user({ 'resume': rawResume }));
        return response;
    }
};