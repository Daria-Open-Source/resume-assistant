import axios from 'axios';

export default class ResumeProvider {

    constructor(url = 'http://localhost:3000') {
        this.url = url;
    }

    async provideResumes(resumeSource) {

        // get the resumes
        const resumes = await resumeSource.getResumes();
        
        // post them to the server
        const response = await axios.post(
            this.url,
            resumes
        );

        // pivot on server response
        if (response.status < 300) console.log('successfully sent resumes');
        else console.log('encountered error %O', response.data.error);
    }
}