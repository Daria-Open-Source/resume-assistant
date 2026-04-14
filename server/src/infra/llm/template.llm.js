/*
    Defines an interface for interacting with LLM implementations.
    Ensures a common workflow: construct to set client, provide a query, then execute
    Child classes have to work around this; they override these functions
*/

export class TemplateLanguageModel {

    constructor (client) { this.client = client; }

    // interacts with a client to 
    async executePrompt() { throw new Error('This method is not implemented. Check the child of TemplateLLM and ensure this method is overridden.'); }
};