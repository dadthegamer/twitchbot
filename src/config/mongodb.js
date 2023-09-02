// Import cache
import { MongoClient } from 'mongodb';
import { writeToLogFile } from '../utils/logging.js'
import { config } from 'dotenv';

config();

const uri = `mongodb://${process.env.MONGO_INITDB_DATABASE_HOST}:${process.env.MONGO_INITDB_DATABASE_PORT}`;

export class MongoDBConnection {
    constructor() {
        this.host = process.env.MONGO_INITDB_DATABASE_HOST;
        this.port = process.env.MONGO_INITDB_DATABASE_PORT;
        this.uri = `mongodb://${this.host}:${this.port}`;
        this.client = new MongoClient(uri);
        this.dbName = 'website';
        this.dbConnection = null;
        return MongoDBConnection.instance;
    }

    // Method to connect to MongoDB
    async connect() {
        try {
            await this.client.connect();

            console.log('Connected to MongoDB');

            this.dbConnection = this.client.db(this.dbName);

        } catch (error) {
            console.error('Error connecting to MongoDB', error);
            throw error;
        }
    }

    // Method to close MongoDB connection
    async close() {
        try {
            if (this.dbConnection) {
                await this.client.close();
                this.dbConnection = null;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error closing MongoDB connection: ${error}`);
        }
    }

    // Method to create collections if they dont exist
    async createCollections() {
        try {
            const collections = [
                'sessions',
                'tokens',
                'streams',
                'users',
                'currency',
                'commands',
                'settings',
                'quotes',
                'roasts',
                'games',
            ]
            const collectionPromises = collections.map(collection =>
                this.dbConnection.createCollection(collection)
            );
            await Promise.all(collectionPromises);
        }
        catch (error) {
            writeToLogFile('error', `Error creating collections: ${error}`);
        }
    }

    // Method to create indexes if they dont exist
    async createIndexes() {
        try {
            await this.dbConnection.collection('users').createIndex({ userId: 1 });
            await this.dbConnection.collection('commands').createIndex({ name: 1 });
        }
        catch (error) {
            writeToLogFile('error', `Error creating indexes: ${error}`);
        }
    }

    // Method to check the connection to MongoDB
    async checkConnection() {
        try {
            await this.dbConnection.command({ ping: 1 });
        }
        catch (error) {
            writeToLogFile('error', `Error checking MongoDB connection: ${error}`);
        }
    }
}
