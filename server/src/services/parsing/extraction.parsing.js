import { GroqLLM } from "../integration/llm.integration.js";

export class TextExtractor {

    constructor () { this.llm = new GroqLLM(); }

    // define several extraction methods that use LLMs
    
    // splits resume text into json mapping of section to section text. Also skips all sensitive info, W privacy system?? 
    async chunkResumeText(resumeAsText) {
        throw new Error('This method is deprecated! Use .chunkResumeText_v2');
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

    // this is an improved chunking method. It takes raw text, then breaks down chunks by subsection within a section
    // it returns a mapping of sectionName to an array of section chunks
    // ex. if an Experience section has multiple jobs, then each job is a chunk
    async chunkResumeText_v2(resumeAsText) {

        const system = `

            You are given raw resume text and are tasked with breaking it into sections then chunks.
            A section starts with a text header similar to any of these: Experience, Projects, Education, Skills, Leadership.
            A chunk is an organized subsection within a section. All resume sections besides Skills have chunks.

            EXAMPLE: if the Experience section has two jobs, each with bullet points and information, each job is a chunk.

            RESPONSE TYPE: Return a JSON of sectionName to an array of sectionChunks.

            sectionName is one of Experience, Projects, Education, Skills, or Leadership. If a resume section doesn't use this word, associate that section with the section name most similar.
            sectionChunks is an array of chunks, which is the raw text associated with a subsection.

            DO NOT provide additional information. Only provide the JSON output as specified.
            DO NOT identify the heading text as a section. Intentionally exclude all personal information.
        `;

        const user = resumeAsText;
        const response = await this.llm.executePrompt(system, user);
        return response;
    }
};