import mongoose from 'mongoose';

// schema for chunk collection
const ResumeSchema = new mongoose.Schema({
    
    // the pre-chunked resume
    // note no embedding vectors
    chunkedResume: {
        
        education: {
            type: [String],
            default: null
        },
        
        experience: {
            type: [String],
            default: null
        },

        projects: {
            type: [String],
            default: null,

        },

        leadership: {
            type: [String],
            default: null
        },

        skills: {
            type: [String],
            default: null
        }
    },

    // global meta are values
    // shared across all chunks
    // of this resume
    globalMeta: {
        major: String,
        year: Number,
        roles: [String]
    }
}, 
{
    timestamps: {
        createdAt: true,
        updatedAt: true
    }
});

export const ResumeModel = new mongoose.model('Resume', ResumeSchema);