import { MongoClient, Db } from 'mongodb';
import axios from 'axios';
import cron from 'node-cron';
import dotenv from 'dotenv';
import Busboy from 'busboy';

dotenv.config();
import 'dotenv/config'

/**
 * ResumeService handles the synchronization of PDF resumes from an external 
 * provider (via Jacob's server) to MongoDB.
 */
export class ResumeService {
    private static instance: ResumeService;
    private client: MongoClient;
    private db: Db | null = null;

    private constructor() {
        // Initialize Mongo client using the URI from .env
        this.client = new MongoClient(process.env.MONGO_URI || '');
    }

    /**
     * Singleton accessor: Ensures only one database connection pool 
     * is active across the entire application.
     * preventing connection exhaustion and maintaining a single source of truth
     */
    public static getInstance(): ResumeService {
        if (!ResumeService.instance) {
            ResumeService.instance = new ResumeService();
        }
        return ResumeService.instance;
    }

    /**
     * Establishes a connection to MongoDB Atlas if one doesn't already exist.
     */
    async connect() {
        if (!this.db) {
            await this.client.connect();
            this.db = this.client.db(process.env.DB_NAME);
            console.log("Connected to MongoDB Atlas");
        }
    }

    /**
     * Core Sync Logic: 
     * 1. Streams multipart/form-data from the provider.
     * 2. Uses Busboy to parse individual file buffers from the stream.
     * 3. Upserts (Updates or Inserts) the binary PDF data into Atlas.
     */
    async syncResumes() {
        try {
            await this.connect();
            const collection = this.db!.collection('resumes');

            console.log("🔄 Starting sync from provider...");

            // Fetch data as a stream to handle binary PDF data without crashing memory
            const response = await axios.get(process.env.RESUME_PROVIDER_URL || '', {
                responseType: 'stream'
            });

            // Initialize Busboy with the Content-Type header from the provider
            const busboy = Busboy({ headers: { 'content-type': response.headers['content-type'] } });

            // Event listener: Triggered every time Busboy detects a file in the stream
            busboy.on('file', (name, file, info) => {
                const { filename, mimeType } = info;
                let chunks: Buffer[] = [];

                // Collect binary data chunks as they arrive
                file.on('data', (data) => {
                    chunks.push(data);
                });

                // Once the full file is received, process it for the database
                file.on('end', async () => {
                    const buffer = Buffer.concat(chunks);
                    
                    // Upsert: If externalId exists, update content; otherwise, create new doc.
                    await collection.updateOne(
                        { externalId: filename }, 
                        { 
                            $set: { 
                                content: buffer, 
                                contentType: mimeType,
                                syncedAt: new Date() 
                            } 
                        },
                        { upsert: true }
                    );
                    console.log(`Successfully stored PDF: ${filename}`);
                });
            });

            // Feed the Axios response stream directly into the Busboy parser
            response.data.pipe(busboy);

        } catch (err) {
            console.error("Sync failed:", err instanceof Error ? err.message : err);
        }
    }

    /**
     * Starts a background task to sync data every hour.
     * Also triggers an immediate sync upon server startup for testing.
     */
    public startCron() {
        // Schedule: Minute 0 of every hour
        cron.schedule('0 * * * *', () => this.syncResumes());
        
        // Immediate execution to ensure data is present for the current session
        this.syncResumes();
    }
}