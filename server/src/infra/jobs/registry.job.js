import { UpdateResumeCollection } from './getResumes.job.js';
import { UpdateChunksCollection } from './insertChunks.job.js';

const updateResumes = new UpdateResumeCollection();
const updateChunks = new UpdateChunksCollection();

export const JobRegistry = {
    'updateResumes': updateResumes,
    'updateChunks':  updateChunks
};