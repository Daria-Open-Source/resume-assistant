import { Ollama } from "ollama";

import { TemplateLanguageModel } from "./template.llm.js";

export class OllamaLLM extends TemplateLanguageModel {
    constructor() {
        super(new Ollama({ host: 'http://localhost:11434' }));
    }

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
};