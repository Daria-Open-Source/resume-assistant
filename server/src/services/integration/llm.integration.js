import Groq from 'groq-sdk';

/*
    Defines an interface for interacting with LLM implementations.
    Ensures a common workflow: construct to set client, provide a query, then execute
    Child classes have to work around this; they override these functions
*/

class TemplateLanguageModel {

    constructor (client) { this.client = client; }

    // interacts with a client to 
    async executePrompt() { throw new Error('This method is not implemented. Check the child of TemplateLLM and ensure this method is overridden.'); }
};


export class GroqLLM extends TemplateLanguageModel {

    constructor() { super(new Groq({ apiKey: process.env.GROQ_API_KEY })); }

    async executePrompt(systemPrompt, userPrompt, documents) {
        
        // guard that prevents missing fields
        if (null in [systemPrompt, userPrompt, documents])
            throw new Error('run .preparePrompt() before executing!');


        // execute response to groq server
        const response = await this.client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user',   content: userPrompt }
            ],
            temperature: 0,
            response_format: { type: "json_object" }
        });

        // clean and return response
        const rawText = response.choices[0].message.content;
        const cleanedText = this.cleanResponse(rawText);
        return cleanedText;
    }

    cleanResponse(text) {
        const clean = text
            .trim()
            .replace(/^```json/, '')
            .replace(/^```/, '')
            .replace(/```$/, '')
            .trim();

        return JSON.parse(clean);
    }   
};