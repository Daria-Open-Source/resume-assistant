import { google } from 'googleapis';


class TemplateSource {
    
/* 
    A source refers to the concept of a Resume Source, a place we get resumes from
    This Source object should act as an interface for different repository types,
    such as MongoDB or a Google Drive folder.

    The Parent defines guaranteed functions that the provider interacts with
    The Children implement specific methods unique to their repository 
*/

    // identifies the source
    constructor(sourceName) {
        this.source = sourceName;
    }

/*
    The getResumes function is how a Provider will interact with a Source.
    getResumes should be overridden by child Sources
    getResumes should return an array of jsons, with a buffer field for representing the pdf in binary
*/
    async getResumes() {

    }
};

export class GoogleDriveSource extends TemplateSource {
    constructor(sourceName = 'Google Drive') {
        super(sourceName);
        this.folderId = '1_EWuPrjRmbMoJitZfFOTBINQgqxare1m';

        // the auth variable references a service key, which is associated with a service account
        // service accounts can use resources on behalf of a user. This account can only use the Drive API
        this.auth = new google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive']
        });

        this.drive = google.drive({ version: 'v3', auth: this.auth });
    }

    async getResumes() {
        
        let binaries = [];
        let metadata = [];

        // gets files from a subfolder called resumes
        const response = await this.drive.files.list({
            fields: 'files(id, name, parents)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        // console.log(response.data.files);

        // for each file, download and save it to the array 
        const files = response.data.files.filter(f => f.name.endsWith('.pdf'));
        for (const f of files) {
            
            // fetch procedure
            const pdf = await this.drive.files.get({ 
                fileId: f.id,
                alt: 'media',
                supportsAllDrives: true,
            }, { responseType: 'arraybuffer' });
            
            // save procedure
            binaries.push(Buffer.from(pdf.data));
            metadata.push({
                name: f.name,
                id:   f.id
            });
        }

        return { binaries, metadata };
    }
}