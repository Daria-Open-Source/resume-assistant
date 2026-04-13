import mongoose from 'mongoose';

// schema for chunk collection
const ResumeSchema = new mongoose.Schema({
    
    // the pre-chunked resume
    // note no embedding vectors
    chunkedResume: {
        
        education: {
            type: [String],
            default: []
        },
        
        experience: {
            type: [String],
            default: []
        },

        projects: {
            type: [String],
            default: [],

        },

        leadership: {
            type: [String],
            default: []
        },

        skills: {
            type: [String],
            default: []
        }
    },

    // global meta are values
    // shared across all chunks
    // of this resume
    globalMeta: {
        major: { type: [String] },
        year: { type: Number },
        roles: [String]
    },

    sourceId: {
        source: { type: String },
        value: { type: String }
    },

    addedToChunks: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

export const ResumeModel = new mongoose.model('Resume', ResumeSchema);