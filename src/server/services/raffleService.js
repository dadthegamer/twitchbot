import { twitchApi } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';
import logger from '../utilities/logger.js';

// User class 
export class RaffleService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'raffleEntries';
        this.getAllRaffleEntries();
    }

    // Method to get all raffle entries
    async getAllRaffleEntries() {
        try {
            const raffleEntries = await this.dbConnection.collection(this.collectionName).find().toArray();
            this.cache.set('raffleEntries', raffleEntries)
            return raffleEntries;
        } catch (error) {
            logger.error(`Error getting all raffle entries: ${error}`);
        }
    }

    // Method to get raffle entries by userId
    async getRaffleEntriesByUserId(userId) {
        try {
            const raffleEntries = await this.dbConnection.collection(this.collectionName).find({ userId: userId }).toArray();
            return raffleEntries.length;
        } catch (error) {
            logger.error(`Error getting raffle entries by userId: ${error}`);
        }
    }

    // Method to add raffle entries to a user in the cache and database
    async addRaffleEntries(userId, raffleEntries) {
        try {
            const userRaffleEntries = await this.getRaffleEntriesByUserId(userId);
            for (let i = 0; i < raffleEntries; i++) {
                await this.dbConnection.collection(this.collectionName).insertOne({ userId: userId });
            }
        } catch (error) {
            logger.error(`Error adding raffle entries: ${error}`);
        }
    }

    // Method to remove all raffle entries from a user
    async removeAllRaffleEntries(userId) {
        try {
            await this.dbConnection.collection(this.collectionName).deleteMany({ userId: userId });
        } catch (error) {
            logger.error(`Error removing all raffle entries: ${error}`);
        }
    }

    // Method to get a winner from all the raffle entries
    async getRaffleWinner() {
        try {
            const raffleEntries = await this.dbConnection.collection(this.collectionName).find().toArray();
            const winner = raffleEntries[Math.floor(Math.random() * raffleEntries.length)];
            const userInfo = await twitchApi.getUserDataById(winner.userId);
            return userInfo;
        } catch (error) {
            logger.error(`Error getting raffle winner: ${error}`);
        }
    }
}