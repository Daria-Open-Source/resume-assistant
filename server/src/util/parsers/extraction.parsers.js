import { Ollama } from "ollama";
import { GroqLLM } from "../../infra/llm/template.llm.js";
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

export class OllamaTextExtractor {
    constructor () { this.llm = new Ollama({ host: 'http://localhost:11434' }); }

    async executePrompt(system, user) {
        const response = await this.llm.chat({
            model: 'phi3:mini',
            messages: [
                { role: 'system',   content: `${system}` },
                { role: 'user',     content: `${user}` }
            ],
            format: 'json',
            options: { temperature: 0 }
        });

        return JSON.parse(response.message.content);
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
}