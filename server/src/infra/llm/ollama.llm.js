import { Ollama } from "ollama";
import { TemplateLanguageModel } from "./template.llm.js";

export class OllamaLLM extends TemplateLanguageModel {
    constructor() {
        super(new Ollama({ host: 'http://localhost:11434' }));
    }

    async executePrompt(system, user) {
        const response = await this.client.chat({
            model: 'qwen2.5:0.5b',
            messages: [
                { role: 'system',   content: `${system}` },
                { role: 'user',     content: `${user}` }
            ],
            format: 'json',
            stream: false,
            request_options: {
                timeout: 300000,
            },
            options: { 
                temperature: 0,
                num_thread: 6,
                num_ctx: 2048
             }
        });

        try {
            const parsed = JSON.parse(response.message.content);
            return parsed;
        } catch(error) {
            console.log(error);
            return response.message.content;
        }
    }
};