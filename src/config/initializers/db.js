import { MongoDBConnection } from './config/mongodb.js';


export const db = new MongoDBConnection();

export async function initializeDb() {
    await db.connect();
    console.log('Connected to MongoDB');
}