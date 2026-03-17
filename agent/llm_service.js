const Groq = require('groq-sdk');

//Define Schema to send to llm
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

//LLM Class holds api KEY, Query, Documents, prompt and fills them in
class LLM {
    constructor() {
        this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
        this.userQuery = null;
        this.documents = null;
        this.ready = false;
        this.systemPrompt = null;
    }

    preparePrompt() {
        try {
            this.systemPrompt = SYSTEM_PROMPT;
            this.ready = true;
            return true;
        } catch {
            return false;
        }
    }

    injectUserQuery(userQuery) {
        this.userQuery = userQuery;
    }

    injectDocuments(documents) {
        this.documents = documents;
    }

    //Executes prompt with schema
    async executeQuery() {
        if (!this.ready) {
            throw new Error('LLM not prepared. Call preparePrompt() first.');
        }
        
        const userMessage = `
            ##Retrieved Resumes From Similar Role Holders
            ${this.documents ? JSON.stringify(this.documents, null, 2) : 'No documents retrieved.'}

            ##User Resume + Target Role
            ${this.userQuery}
        `;

        //Run prompt into llm
        try {
            const response = await this.client.chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user',   content: userMessage }
                ],
                temperature: 0.3,
            });

            const raw = response.choices[0].message.content;

            //Strip markdown code if neccesary from response
            const clean = raw
                .trim()
                .replace(/^```json/, '')
                .replace(/^```/, '')
                .replace(/```$/, '')
                .trim();

            const parsed = JSON.parse(clean);
            return { ok: true, data: parsed };

        } catch (err) {
            if (err instanceof SyntaxError) {
                return { ok: false, error: `JSON parse failed: ${err.message}` };
            }
            return { ok: false, error: err.message };
        }
    }
}

module.exports = { LLM };