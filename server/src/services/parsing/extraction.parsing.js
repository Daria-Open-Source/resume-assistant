import { GroqLLM } from "../integration/llm.integration.js";
import PromptRegistry from "../prompts/registry.prompts.js";

export class TextExtractor {

    constructor () { this.llm = new GroqLLM(); }

    async chunkResumeText(resumeAsText) {

        // get prompts
        const system = PromptRegistry.TEXT_EXTRACTION.CHUNKING.system();
        const user = PromptRegistry.TEXT_EXTRACTION.CHUNKING.user({ 'resume': resumeAsText });

        // returns mapping of sectionName: [stringChunks]
        const response = await this.llm.executePrompt(system, user);
        return response;
    }

    async extractResumeMetadata(sectionToChunks) {
        
        // get prompts
        const system = PromptRegistry.TEXT_EXTRACTION.METADATA.system();
        const user = PromptRegistry.TEXT_EXTRACTION.METADATA.user({ 'chunkedResume': sectionToChunks });
        
        // returns mapping of sectionName: [stringChunks]
        const response = await this.llm.executePrompt(system, user);
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