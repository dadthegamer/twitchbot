import logger from "../utilities/logger.js";

// Class to handle all stream related services
class GameService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'gameSettings';
        this.setInitialJackpot();
        this.getJackpot();
    }

    // Method to set the initial jackpot amount in the database and cache if it doesn't exist
    async setInitialJackpot() {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (!data) {
                const data = {
                    id: 'jackpot',
                    jackpot: 25000,
                    currency: 'points',
                    jackpotPCT: 10,
                    jackpotStart: 25000,
                    increaseBy: {
                        min: 100,
                        max: 500
                    }
                }
                await this.dbConnection.collection(this.collectionName).insertOne(data);
                this.cache.set('jackpot', data);
            }
        }
        catch (error) {
            logger.error(`Error in setInitialJackpot: ${error}`);
        }
    }

    // Method to set the jackpot amount in the database and cache
    async setJackpot(jackpot) {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (data) {
                await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { jackpot: jackpot } });
                // Update the cache with the new jackpot amount
                this.cache.set('jackpot', { jackpot: jackpot });
            }
        }
        catch (error) {
            logger.error(`Error in setJackpot: ${error}`);
        }
    }

    // Method to get the jackpot amount from the cache. If it doesn't exist in the cache get it from the database and set it in the cache
    async getJackpot() {
        try {
            let jackpot = this.cache.get('jackpot');
            if (!jackpot) {
                const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
                if (data) {
                    this.cache.set('jackpot', data);
                    jackpot = data;
                }
            }
            return jackpot;
        }
        catch (error) {
            logger.error(`Error in getJackpot: ${error}`);
        }
    }

    // Method to increase the jackpot amount in the database and cache
    async increaseJackpot(amount) {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (data) {
                const jackpot = data.jackpot + amount;
                await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { jackpot: jackpot } });
                // Update the cache with the new jackpot amount
                this.cache.set('jackpot', { jackpot: jackpot });
            }
        }
        catch (error) {
            logger.error(`Error in increaseJackpot: ${error}`);
        }
    }

    // Method to reset the jackpot amount in the database and cache based on the jackpot start amount
    async resetJackpot() {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (data) {
                const jackpot = data.jackPotStart;
                await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { jackpot: jackpot } });
                // Update the cache with the new jackpot amount
                this.cache.set('jackpot', { jackpot: jackpot });
            }
        }
        catch (error) {
            logger.error(`Error in resetJackpot: ${error}`);
        }
    }
}

export default GameService;