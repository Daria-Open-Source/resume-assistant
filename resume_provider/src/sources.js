import { google } from 'googleapis';


class TemplateSource {
    
/* 
    A source refers to the concept of a Resume Source, a place we get resumes from
    This Source object should act as an interface for different repository types,
    such as MongoDB or a Google Drive folder.

    The Parent defines guaranteed functions that the provider interacts with
    The Children implement specific methods unique to their repository 
*/

/*
     
*/
    constructor(sourceName) {
        this.source = sourceName;
    }

/*
    The getResumes function is how a Provider will interact with a Source.
    getResumes should be overridden by child Sources
    getResumes should return an array of Resume objects
*/
    async getResumes() {

    }
};

export class GoogleDriveSource extends TemplateSource {
    constructor(sourceName = 'Google Drive') {
        super(sourceName);

        // the auth variable references a service key, which is associated with a service account
        // service accounts can use resources on behalf of a user. This account can only use the Drive API
        this.auth = new google.auth.GoogleAuth({
            keyFile: `service_keys\\daria-484521-b2af964deca3.json`,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        this.drive = google.drive({ version: 'v3', auth: this.auth });
    }

    async getResumes() {
        
        let resumes = [];

        const response = await this.drive.files.list({
            fields: 'files(id, name)'
        });

        const files = response.data.files;
        for (const f in files) {
            
            // fetch procedure
            const pdf = await this.drive.files.get({ 
                fileId: f.id,
                alt: 'media'
            }, { responseType: 'arraybuffer' });
            
            // save procedure
            resumes.push({
                fileName: f.name,
                data: pdf.data
            });
        }

        return resumes;
    }
}