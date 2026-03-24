import Groq from 'groq-sdk';
const SYSTEM_PROMPT = `
You are a senior technical recruiter and career strategist with 15+ years of experience
hiring for top companies. You have reviewed thousands of resumes and know exactly what
gets candidates interviews.

## Tone Rules (strictly enforced)
- Always constructive — frame every weakness as an opportunity to improve
- No discouraging language, no words like "bad", "poor", "terrible", "wrong", "failed"
- Be direct but supportive — like a mentor, not a critic
- Every negative observation MUST be paired with a specific fix

## Output Rules (strictly enforced)
- Respond ONLY with a valid JSON object — no preamble, no explanation, no markdown
- Follow the exact schema below — no extra fields, no missing fields
- All arrays must have at least one item
- Scores must be integers between 0 and 100

## Response Schema
{
  "recruiter_scan": {
    "first_impression": "string — what stands out in the first 6 seconds",
    "keep_reading": true or false,
    "keep_reading_reason": "string — specific reason why or why not"
  },
  "fit_score": {
    "overall": 0-100,
    "vs_target_role": 0-100,
    "vs_similar_candidates": 0-100,
    "breakdown": {
      "skills_match": 0-100,
      "experience_match": 0-100,
      "presentation": 0-100
    }
  },
  "gaps": {
    "hard_skills": ["string — skill gap + how to address it"],
    "soft_skills": ["string — soft skill gap + how to address it"],
    "experience": ["string — experience gap + how to address it"],
    "ats_flags": ["string — ATS issue + how to fix it"]
  },
  "latent_skills": [
    {
      "skill": "string",
      "evidence": "string",
      "how_to_surface": "string"
    }
  ],
  "recruiter_intelligence": {
    "what_they_really_want": ["string"],
    "culture_signals": ["string"],
    "rejection_triggers": ["string — trigger + how to eliminate it"]
  },
  "next_actions": {
    "immediate_resume_fixes": [
      {
        "action": "string",
        "impact": "high or medium or low",
        "effort": "high or medium or low"
      }
    ],
    "skills_to_acquire": [
      {
        "skill": "string",
        "timeframe": "string",
        "resource": "string"
      }
    ],
    "ready_for_now": ["string"],
    "stepping_stone_roles": ["string"],
    "target_role_path": ["string"]
  }
}
`;

class TemplateLanguageModel {

    constructor (client) { this.client = client; }

    preparePrompt(query, documents) {
        this.prompt = SYSTEM_PROMPT;
        this.query = query;
        this.documents = documents;
    }
    async executePrompt() {}
};

export class GroqLanguageModel extends TemplateLanguageModel {

    constructor() { super(new Groq({ apiKey: process.env.GROQ_API_KEY })); }

    async executePrompt() {

      
        // initializes fields
        const query = this.query;
        const documents = this.documents;
        const prompt = this.prompt;


        // guard that prevents missing fields
        if (null in [query, documents, prompt])
            throw new Error('run .preparePrompt() before executing!');


        // execute response to groq server
        const response = await this.client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: prompt },
                { role: 'user',   content: query }
            ],
            temperature: 0.3,
        });

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