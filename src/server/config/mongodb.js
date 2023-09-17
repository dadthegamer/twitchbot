// Import cache
import { MongoClient } from 'mongodb';
import { writeToLogFile } from '../utilities/logging.js'
import { config } from 'dotenv';

config();

class MongoDBConnection {
    constructor() {
        this.host = process.env.MONGO_INITDB_DATABASE_HOST;
        this.port = process.env.MONGO_INITDB_DATABASE_PORT;
        this.uri = `mongodb://${this.host}:${this.port}`;
        this.client = new MongoClient(this.uri);
        this.dbName = 'twitchBot';
        this.dbConnection = null;
    }

    // Method to connect to MongoDB
    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
            this.dbConnection = this.client.db(this.dbName);
            await this.createCollections();
            await this.createIndexes();
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
                'streamSettings',
                'streamData',
                'users',
                'currency',
                'commands',
                'settings',
                'quotes',
                'roasts',
                'notifications',
                'chatLogs',
                'channelRewards',
                'gameSettings',
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
            const status = await this.dbConnection.command({ ping: 1 });
            if (status.ok) {
                console.log('MongoDB connection is ok');
                return true;
            } else {
                console.log('MongoDB connection is not ok');
                return false;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error checking MongoDB connection: ${error}`);
        }
    }

    // Method to rename a collection
    async renameCollection(oldName, newName) {
        try {
            await this.dbConnection.collection(oldName).rename(newName);
        }
        catch (error) {
            writeToLogFile('error', `Error renaming collection: ${error}`);
        }
    }
}

export default MongoDBConnection;
