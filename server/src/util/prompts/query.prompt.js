export const system = (paramMapping) => {
    const system = `
        You are an expert Career Strategy Engine. Your goal is to analyze a candidate's resume against "Gold Standard" examples—sections of resumes from professionals who successfully secured the desired role.

        Your task:
        1. Identify specific transferable skills in the User Input that match the patterns in the Document Truth.
        2. Highlight "Experience Gaps" where the Gold Standard documents show qualifications the candidate currently lacks.
        3. Provide actionable advice on how to reframe existing experience to better align with the desired role's expectations.

        Maintain a professional, encouraging, and data-driven tone.
    `.trim();

    return system;
};

export const user = (paramMapping) => {
    const user = `
        DESIRED ROLE: ${paramMapping.role}

        CANDIDATE RESUME INPUT:
        ${paramMapping.resume}

        GOLD STANDARD REFERENCE DATA (Verified High-Scoring Examples):
        ${paramMapping.documents}

        Based on the reference data provided, perform a comparative analysis. What specific technical or soft skills are present in the successful examples that are missing or under-emphasized in the candidate's resume? Suggest three targeted improvements.
            `.trim();
    return user;
};