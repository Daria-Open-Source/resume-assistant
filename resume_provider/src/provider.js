import axios from 'axios';

export default class ResumeProvider {

    constructor(url = 'http://localhost:3000') {
        this.url = url;
    }

    static async getResumesFromSource(resumeSource) {
        const resumes = await resumeSource.getResumesDriver();

        if (resumes == null) throw new Error('null return from resume source');
        if (typeof resumes != typeof Array) throw new Error('return from resume source was not type Array, was type %O', typeof resumes);

        return resumes;
    }

    static async uploadResumesToRemote(url, resumes) {
        
        // upload data to the remote server
        const response = await axios.post(
            url,
            resumes
        );

        if (response.status < 300) return true;

        console.log('encountered error\n', response.data.error);
        return false;
    }
}