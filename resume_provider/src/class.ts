import { ResumeSource } from "./interfaces";
import axios from 'axios';

export default class ResumeProvider {
    REQUEST_URL: string = 'http://localhost:3000';

    constructor() {

    }

    async provideResumes(resumeSource: ResumeSource) {

        const resumes = resumeSource.getResumeData(null);
        const response = await axios.post(
            this.REQUEST_URL,
            resumes
        );

        if (response.status < 300)
            console.log('successfully sent resumes');
        else
            console.log('encountered error %O', response.data);
    }
}