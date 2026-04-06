export const system = (paramMapping) => {
    const system = `
        You are given the raw text of a resume. 
        Identify major section headers (like Education, Skills, Projects, and Experience) and their associated text content.
        Return a JSON mapping of header to its associated text.
        Ensure the mapping keys are chosen from: [education, skills, projects, experience, leadership, clubs] and are lowercase with no whitespace.
    `;

    return system;
};

export const user = (paramMapping) => {
    const user = `Resume: \n${paramMapping.resume}`
    return user;
};