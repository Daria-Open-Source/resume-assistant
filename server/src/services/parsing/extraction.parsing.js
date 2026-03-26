import { GroqLLM } from "../integration/llm.integration.js";

export class TextExtractor {

    constructor () { this.llm = new GroqLLM(); }

    // define several extraction methods that use LLMs
    
    // splits resume text into json mapping of section to section text. Also skips all sensitive info, W privacy system?? 
    async chunkResumeText(resumeAsText) {

        const system = `
            You are given the raw text of a resume. 
            Identify major section headers (like Education, Skills, Projects, and Experience) and their associated text content.
            Return a JSON mapping of header to its associated text.
            Ensure the mapping keys are chosen from: [education, skills, projects, experience, leadership, clubs] and are lowercase with no whitespace.
        `;

        const user = `Resume: \n${resumeAsText}`;
        const response = await this.llm.executePrompt(system, user);
        return response;
    }


    // takes the resume text and identifies metadata
    async extractResumeMetadata(resumeAsText) {

        const system = `
            You are given the raw text of a resume. 
            Identify the graduation year, first named major, and their roles.
            Graduation Year should be a 4-digit number, representing the year the person graduated or will graduate.
            First Named Major is the first major they list. If not listed, infer it from other areas. If the resume does not have an education section, assume this is null
            roles should be an array of strings.
            Use keys: class, major, and roles. 
            Respond in json format, using null if a field is not found.
        `;

        const user = `Resume: \n${resumeAsText}`;
        const response = await this.llm.executePrompt(system, user);
        return response;
    }
};