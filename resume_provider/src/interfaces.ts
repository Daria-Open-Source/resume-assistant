export interface ResumeSource {
    getResumeData(id: string | null): Promise<any>
}

// Implementation for MongoDB
export class MongoSource implements ResumeSource {
  async getResumeData(id: string | null) {
    console.log('initiating read from mongoDB');
    // get a Google Drive client
    // inject credentials
    // get the files

    console.log("Sending files from mongo");
    return { name: "John Doe", source: "Database" }; 
  }
}

// Implementation for Google Drive
export class GoogleDriveSource implements ResumeSource {
  async getResumeData(id: string | null) {

    console.log('initiating read from google drive');
    // get a Google Drive client
    // inject credentials
    // get the files

    console.log('sending files from google cloud')
    return { name: "Jane Smith", source: "Cloud Storage" };
  }
}