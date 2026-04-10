import 'dotenv/config';
import { ParsingRegistry } from './services/parsing/registry.parsing.js'
import { Scheduler } from './services/orchestration/scheduler.orchestration.js';
import { ResumeJob } from './services/orchestration/job.orchestration.js';
import { OllamaEmbeddingModel } from './services/integration/embedding.integration.js';
import { OllamaTextExtractor } from './services/parsing/extraction.parsing.js';
import PromptRegistry from './services/prompts/registry.prompts.js';


const jobs = [new ResumeJob()];
const scheduler = new Scheduler(jobs);
scheduler.startJobs();



const text = `
Jacob Hebbel
508-496-8896 | hebbej@rpi.edu | linkedin.com/in/jacobhebbel | github.com/jacobhebbel
Education
Rensselaer Polytechnic Institute (RPI)
Pursuing Dual B.S. in Computer Science, Information Technology and Web Science
Expected 2027
Troy, NY
Software Coursework: Algorithms, Data Structures, Principles of Software, Web Systems, Web Science, HCI & Usability
AI Coursework: Deep Learning, Deep Learning on Graphs, Intro AI, Machine Learning, Computer Vision, Linear Algebra
GPA: 3.03 | In-Major: 3.22
Experience
Founder, Backend Engineer
A funded Data Analytics startup
January 2026– Present
Troy, NY
• Designed robust Upload and ETL pipelines using GCP BigQuery, CloudStorage, and VertexAI
• Deployed Node.js server with CI/CD test suite to GCP Cloud Run, optimized performance subject to cost
• Constructed a RAG pipeline for Resume Analysis that provides edits based on historical success samples
• Managed DevOps with GitHub Projects, Docker containers, and a Makefile for authentication with GCP
Software Engineering Intern
HARP Research
May 2025– August 2025
Troy, NY
• Engineered a Python job scraper with a MySQL pipeline collecting 2500 items/day using Scrapy and Selenium
• Developed a Python ecommerce chatbot with product recommendation, order lookup, and Slack integration
• Deployed a Twitter Chatbot with TwitterAPI and OpenAI API with Python
Open Source Mentor
Rensselaer Center for Open Source
January 2025– December 2025
Troy, NY
• Used GitHub to ensure code quality/quantity standards were met for 60+ people over 20 projects
• Presented workshops on Graph Neural Networks and how to build Neural Networks with PyTorch
Projects
Backend Engineer for Finance Club | Express, Flask, LLMs, Bloomberg API September 2025– January 2026
• Developed a Bloomberg Terminal chatbot using Python and HuggingFace that won a hackathon prize
• Designed a server architecture using Node.js (Express) and Python (Flask) for moving large time-series data
• Built a Python cache for API calls that reduced load time from 10 to 2 seconds
• Deployed server to AWS using GitHub Actions and Continuous Deployment
Backend Engineer for Beekeeping Mobile App | Express, MongoDB, CI/CD August 2025– December 2025
• Built a Node.js (Express) server that utilized the router-controller-service design pattern for modular development
• Integrated server with MongoDB using Mongoose schemas and Joi field validation
• Architectured a secure JWT login system utilizing the access/refresh paradigm and token tracking
• Implemented CI/CD test suite with Jest and Supertest that integrates with GitHub Actions workflow
• Migrated the backend to TypeScript in February 2026
Project Manager for Various Web Apps | MERN, XAMPP, Git, Kanban
January 2024– May 2025
• Utilized KanBan, GitHub, and modern workflow practices to coordinate cross-functional teams to meet deadlines
• Taught teams Web Science, tech stacks, and CLI Git to develop applications that deployed to Heroku and Render
Leadership
Director of Technology for Competitive Programming Club
September 2024– Present
• Lead weekly problem discussions about algorithms, data structures, and optimization strategies
• Deployed an Ubuntu server for programming contest, running an Autograder for 60+ concurrent users
President of College Piano Club
September 2023– Present
• Founded the club as a freshman, grew it to over 20 people, and oversaw it become university recognized
• Launched tutoring initiative backed by custom Discord bot with Python and MongoDB as a booking service
Research Lead, Web Consultant for Artificial Intelligence Club
September 2025– December 2026
• Developed a Optical Music Recognition model pipeline to automate a bottleneck task in music composition
• Worked with a team of 5 in paper readings and model training, fostered proficiency in PyTorch
• Oversaw development of RAG agents app, connecting Pinecone and Mongo with FastAPI and deployed to AWS
`;


// chunk input
/*
const Extractor = new OllamaTextExtractor();
const Embedder = new OllamaEmbeddingModel();
await Embedder.initialize();

const chunked = await Extractor.executePrompt(
    PromptRegistry.TEXT_EXTRACTION.CHUNKING.system(),
    PromptRegistry.TEXT_EXTRACTION.CHUNKING.user({ 'resume': text })
);

console.log(chunked);

const metadata = await Extractor.executePrompt(
    PromptRegistry.TEXT_EXTRACTION.GLOBAL_METADATA.system(),
    PromptRegistry.TEXT_EXTRACTION.GLOBAL_METADATA.user({ 'resume': text })
);

console.log(metadata);

// vectorize input
let embeddings = {};
for (const [section, docs] of Object.entries(chunked)) {
    embeddings[section] = await Embedder.embed(docs);
}



console.log(JSON.stringify(embeddings, null, 2));
console.log(metadata);
*/
process.stdin.resume();