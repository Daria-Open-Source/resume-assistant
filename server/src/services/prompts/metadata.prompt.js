export const system = (paramMapping) => {
    const system = `
        You are given the raw text of a resume. 
        Identify the graduation year, first named major, and their roles.
        Graduation Year should be a 4-digit number, representing the year the person graduated or will graduate.
        First Named Major is the first major they list. If not listed, infer it from other areas. If the resume does not have an education section, assume this is null
        roles should be an array of strings.
        Use keys: class, major, and roles. 
        Respond in json format, using null if a field is not found.
    `;

    return system;
};

export const user = (paramMapping) => {
    const prompt = `Resume: \n${paramMapping.resume}`;
    return prompt;
}