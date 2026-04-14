export const system = (paramMapping) => {
    
    const sectionPrompts = {
        
        education: `
        3. DEFINITIONS:
        - MAJOR: An array of each major listed. If multiple are present, store as separate elements in the array.
        - QUALIFIER: The specific classification of each GPA found. Pick kind from ["overall", "in-major", "undergraduate", "graduate" or "semester"]
        
        4. EXPECTED SCHEMA: 
        {
            "school": String, 
            "major": [String], 
            "coursework": [String], 
            "gpa": [{qualifier: String, number: Number}]
        },
        
        5. EXAMPLE TRANSFORMATION:
        Input: SECTION: education CONTENT: Rensselaer Polytechnic Institute (RPI)\nPursuing Dual B.S. in Computer Science, Information Technology & Web Science\nExpected 2027\nTroy, NY\nSoftware Coursework: Algorithms, Data Structures, Principles of Software, Web Systems, Web Science, HCI & Usability\nAI Coursework: Deep Learning, Deep Learning on Graphs, Intro AI, Machine Learning, Computer Vision, Linear Algebra\nGPA: 3.03 | In-Major: 3.22 
        Output: { "school": "Rensselaer Polytechnic Institute", "major": ["Computer Science", "Information Technology & Web Science"],  "coursework": ["Algorithms", "Data Structures", "Principles of Software", "Web Systems", "Web Science", "HCI & Usability", "Deep Learning", "Deep Learning on Graphs", "Intro AI", "Machine Learning", "Computer Vision", "Linear Algebra"], "gpa": [ { qualifier: "overall", number: 3.03 }, { qualifier: "in-major", number: 3.22 } ]}`,
        
        experience: `
        3. DEFINITIONS:
        - SKILLS: Methodologies, domains, or abstract abilities (e.g., "RAG", "Project Management").
        - TOOLS: Specific technologies, languages, or software (e.g., "GCP", "React", "Docker"). Associate this field with the 'toolsUsed' key.
        - ROLE: Can be comma-separated if multiple roles are clearly present in the text

        4. EXPECTED SCHEMA: 
        { 
            "company": String, 
            "role": [String], 
            "toolsUsed": [String], 
            "skills": [String] 
        }
            
        5. EXAMPLE TRANSFORMATION:
        Input: SECTION: experience CONTENT: Founder, Backend Engineer\nA funded Data Analytics startup\nJanuary 2026– Present\nTroy, NY\n• Designed robust Upload and ETL pipelines using GCP BigQuery, CloudStorage, and VertexAI\n• Deployed Node.js server with CI/CD test suite to GCP Cloud Run, optimized performance subject to cost\n• Constructed a RAG pipeline for Resume Analysis that provides edits based on historical success samples\n• Managed DevOps with GitHub Projects, Docker containers, and a Makefile for authentication with GCP 
        Output: { "company": "Unknown Startup", "role": ["Founder", "Backend Engineer"], "skills": ["Data Analytics", "ETL pipeline design", "RAG pipeline construction"], "toolsUsed": ["GCP BigQuery", "Node.js", "Docker"]}`,
        
        projects: `
        3. DEFINITIONS:
        - SKILLS: Methodologies, domains, or abstract abilities (e.g., "RAG", "Project Management").
        - TOOLS: Specific technologies, languages, or software (e.g., "GCP", "React", "Docker"). Associate this field with the 'toolsUsed' key.
        
        4. EXPECTED SCHEMA: 
        {
            "skills": [String], 
            "toolsUsed": [String] 
        }
 
        5. EXAMPLE TRANSFORMATION:
        Input: SECTION: projects CONTENT: Backend Engineer for Finance Club | Express, Flask, LLMs, Bloomberg API September 2025– January 2026\n• Developed a Bloomberg Terminal chatbot using Python and HuggingFace that won a hackathon prize\n• Designed a server architecture using Node.js (Express) and Python (Flask) for moving large time-series data\n• Built a Python cache for API calls that reduced load time from 10 to 2 seconds\n• Deployed server to AWS using GitHub Actions and Continuous Deployment
        Output: { "skills": [ "deployment", "optimization", "chatbots", "natural language processing", "system design", "web development", "web security", "testing",],  "toolsUsed": [ "GithubActions", "AWS", "Bloomberg Terminal", "Cache" , "Python", "HuggingFace", "Node.js", "Express", "Flask" ] }`,

        leadership: `
        3. DEFINITIONS:
        - SKILLS: Methodologies, domains, or abstract abilities (e.g., "RAG", "Project Management").
        - TOOLS: Specific technologies, languages, or software (e.g., "GCP", "React", "Docker"). Associate this field with the 'toolsUsed' key.
        - GROUP (LEADERSHIP): The organization the leadership experience is associated with
        
        4. EXPECTED SCHEMA: 
        { 
            "role": [String], 
            "group": String, 
            "skills": [String], 
            "toolsUsed": [String] 
        }
        
        5. EXAMPLE TRANSFORMATION:
        
        Input: SECTION: leadership CONTENT: Director of Technology for Competitive Programming Club\nSeptember 2024– Present\n• Lead weekly problem discussions about algorithms, data structures, and optimization strategies\n• Deployed an Ubuntu server for programming contest, running an Autograder for 60+ concurrent users
        Output: { "role": ["Director of Technology"], "group": "Competitive Programming Club", "skills": ["presentation", "teaching", "public speaking", "mentoring", "data structures", "algorithms", "server development", "concurrency" ], "toolsUsed": ["Ubuntu"] }`,

        skills: `
        3. DEFINITIONS:
        - SKILLS: Methodologies, domains, or abstract abilities (e.g., "RAG", "Project Management").
        - TOOLS: Specific technologies, languages, or software (e.g., "GCP", "React", "Docker"). Associate this field with the 'toolsUsed' key.
        - CATEGORIES: An array of high-level skill domains or technical clusters (e.g., "Frontend Development", "Cloud Infrastructure", "Data Science").
        
        4. EXPECTED SCHEMA:
        {
            "skills": [String],
            "toolsUsed": [String],
            "categories": [String]
        }

        EXAMPLE TRANSFORMATION:
        Input: SECTION: skills CONTENT: Languages: Python, C++, C, Java, JavaScript, TypeScript, HTML/CSS, SQL (MySQL)\nFrameworks & Libraries: Node.js, React.js, Vite, React Native, Tailwind CSS, Hugging Face\nCloud & Infrastructure: Microsoft Azure, Google Cloud, Docker, Grafana, Zabbix, Wazuh\nDeveloper Tools: Git, Agile/Jira, Eclipse, Blender, Unreal Engine 5
        Output: { "toolsUsed": [ "Git", "Jira", "Eclipse", "Blender", "Unreal Engine 5", "Microsoft Azure", "Google Cloud", "Docker", "Grafana", "Zabbix", "Wazuh", "HuggingFace", "Python", "C++", "C", "Java", "JavaScript", "TypeScript", "HTML/CSS", "SQL", "MySQL", "Node.js", "React.js", "Vite", "React Native", "Tailwind CSS"], "skills": ["Agile"], "categories": ["programming languages", "javascript frameworks", "cloud computing", "telemetry", "game design"]}`
    };
    
    const sectionPrompt = sectionPrompts[paramMapping.section];

    const systemPrompt = `
        You are a Career Data Analyst. You will receive a portion of a resume and the section it belongs to.

        CRITICAL RULES:
        1. OUTPUT VALID JSON ONLY. No prose, no markdown backticks.
        2. MAPPING: Return ONLY the object relevant to the provided SECTION.
        ${sectionPrompt}
        6. NEVER INCLUDE THE EXAMPLE TRANSFORMATION. Unless the text mentions it, do not use the example as a stand-in.`;

    
    return systemPrompt;
};

export const user = (paramMapping) => {
    const userPrompt = `SECTION: ${paramMapping.section} CONTENT: ${paramMapping.text}`;
    return userPrompt;
};