// Defines an interface for interacting with sources of resume data
export default class ResumeProvider {

    // should be essentially static
    constructor() {}

    // gets resume binary data
    static async getResumesFromSource(resumeSource) {
        const { binaries, metadata } = await resumeSource.getResumes();

        // if (resumes == null) throw new Error('null return from resume source');
        // if (typeof resumes != typeof Array) throw new Error(`return from resume source was not type Array, was type ${typeof resumes}`);

        return { binaries, metadata };
    }
}