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
        throw new Error('This method is deprecated');

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
            You are a specialized Resume Parser. Your goal is to segment text into logical subsections (chunks).
            
            RULES:
            1. Identify sections: [Experience, Projects, Education, Skills, Leadership].
            2. Within each section, identify 'chunks' (e.g., individual jobs, individual projects).
            3. REDACT all PII: Names, emails, phones, and specific addresses must be replaced with '[REDACTED]'.
            4. OUTPUT: Return valid JSON only. Format: {"SectionName": ["Chunk 1 text", "Chunk 2 text"]}.
        `;

        const user = resumeAsText;
        const response = await this.llm.executePrompt(system, user);
        return response;
    }

    async extractResumeMetadata_v2(sectionToChunks) {
        const system = `
            You are a Career Data Analyst. You will receive a JSON object representing a resume segmented into sections.
            Your task: Generate a metadata summary and detailed per-chunk insights.

            CRITICAL RULES:
            1. OUTPUT VALID JSON ONLY. No prose, no markdown backticks.
            2. MAPPING: The arrays in 'chunkMetadata' MUST correspond index-for-index with the input arrays.
            3. REDACTION: Ensure no PII (emails, phones) enters the metadata.

            EXAMPLE TRANSFORMATION:
            Input: {"Experience": ["Software Intern at Google. Used Python for APIs."]}
            Output: {
                "globalMetadata": { ... },
                "chunkMetadata": {
                    "Experience": [{ "roles": ["Software Intern"], "skills": ["Python"], "competencies": ["API Development"] }]
                }
            }

            EXPECTED SCHEMA:
            {
                "globalMetadata": {
                    "major": "string or null",
                    "graduationYear": "number or null",
                    "totalYearsExperience": "number"
                },
                "chunkMetadata": {
                    "Education": [{ "coursework": [] }],
                    "Experience": [{ "roles": [], "skills": [], "competencies": [] }],
                    "Projects": [{ "technologies": [], "achievements": [] }],
                    "Leadership": [{ "positions": [], "associations": [], "accomplishments": [] }],
                    "Skills": [{ "soft skills": [], "tools": [], "technical skills": [] }]
                }
            }
        `;

        const user = `Resume Chunked: ${JSON.stringify(sectionToChunks)}`;
        const response = await this.llm.executePrompt(system, user);
        return response;
    }
};