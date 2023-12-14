// Import cache
import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import logger from '../utilities/logger.js';
import { exec } from 'child_process';

config();

class MongoDBConnection {
    constructor() {
        this.host = process.env.MONGO_INITDB_DATABASE_HOST;
        this.port = process.env.MONGO_INITDB_DATABASE_PORT;
        this.userName = process.env.MONGO_INITDB_DATABASE_USERNAME;
        this.password = process.env.MONGO_INITDB_DATABASE_PASSWORD;
        this.uri = `mongodb://${this.host}:${this.port}`;
        this.client = new MongoClient(this.uri);
        this.dbName = 'twitchBot';
        this.dbConnection = null;
    }

    // Method to connect to MongoDB
    async connect() {
        try {
            await this.client.connect();
            this.dbConnection = this.client.db(this.dbName);
            await this.createCollections();
            await this.createIndexes();
        } catch (error) {
            logger.error(`Error connecting to MongoDB: ${error}`);
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
            logger.error(`Error closing MongoDB connection: ${error}`);
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
                'timers',
                'events',
            ]
            const collectionPromises = collections.map(collection =>
                this.dbConnection.createCollection(collection)
            );
            await Promise.all(collectionPromises);
        }
        catch (error) {
            logger.error(`Error creating collections: ${error}`);
        }
    }

    // Method to create indexes if they dont exist
    async createIndexes() {
        try {
            await this.dbConnection.collection('users').createIndex({ userId: 1 });
            await this.dbConnection.collection('commands').createIndex({ name: 1 });
        }
        catch (error) {
            logger.error(`Error creating indexes: ${error}`);
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
            logger.error(`Error checking MongoDB connection: ${error}`);
        }
    }

    // Method to rename a collection
    async renameCollection(oldName, newName) {
        try {
            await this.dbConnection.collection(oldName).rename(newName);
        }
        catch (error) {
            logger.error(`Error renaming collection: ${error}`);
        }
    }

    // Method to backup the database
    async backupDatabase() {
        try {
            const backupPath = '/backup';
            const backupCommand = `mongodump --host ${this.host} --port ${this.port} --out ${backupPath}`;
            exec(backupCommand, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    logger.error(`Error backing up database: ${error}`);
                    return;
                }
                if (stderr) {
                    console.log(stderr);
                    logger.error(`Error backing up database: ${stderr}`);
                    return;
                }
                logger.info(`Database backed up successfully: ${stdout}`);
            });
        }
        catch (error) {
            logger.error(`Error backing up database: ${error}`);
        }
    }

    // Method to restore the database
    async restoreDatabase() {
        try {
            const backupPath = '/backup';
            const restoreCommand = `mongorestore --host ${this.host} --port ${this.port} ${backupPath}`;
            exec(restoreCommand, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`Error restoring database: ${error}`);
                    return;
                }
                if (stderr) {
                    logger.error(`Error restoring database: ${stderr}`);
                    return;
                }
                logger.info(`Database restored successfully: ${stdout}`);
            });
        }
        catch (error) {
            logger.error(`Error restoring database: ${error}`);
        }
    }
}

export default MongoDBConnection;
