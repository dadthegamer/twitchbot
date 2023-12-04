import logger from '../utilities/logger.js';

class CounterService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.getAllCountersFromDB();
    }

    // Method to get all the counters from the database and add them to the cache
    async getAllCountersFromDB() {
        try {
            const countersCollection = this.dbConnection.collection('counters');
            const result = await countersCollection.find({}).toArray();
            this.cache.set('counters', result);
            return result;
        }
        catch (err) {
            logger.error(`Error in getAllCountersFromDB: ${err}`);
        }
    }

    // Method to create a counter
    async createCounter(counter, value) {
        try {
            const countersCollection = this.dbConnection.collection('counters');
            const result = await countersCollection.insertOne({ name: counter, value: value });
            this.getAllCountersFromDB();
            return result;
        }
        catch (err) {
            logger.error(`Error in createCounter: ${err}`);
        }
    }

    // Methood to get a counter
    async getCounter(counter) {
        try {
            // Check if the command is in the cache if it is return it and if it is not get it from the database and add it to the cache
            if (this.cache.has(counter)) {
                return this.cache.get(counter);
            } else {
                const countersCollection = this.dbConnection.collection('counters');
                const result = await countersCollection.findOne({ name: counter });
                this.cache.set(counter, result);
                return result;
            }
        }
        catch (err) {
            logger.error(`Error in getCounter: ${err}`);
        }
    }

    // Method to delete a counter
    async deleteCounter(counter) {
        try {
            const countersCollection = this.dbConnection.collection('counters');
            const result = await countersCollection.deleteOne({ name: counter });
            this.getAllCountersFromDB();
            return result;
        }
        catch (err) {
            logger.error(`Error in deleteCounter: ${err}`);
        }
    }

    // Method to increase a counter
    async increaseCounter(counter, value) {
        try {
            // Increase the counter in the cache and the database
            const countersCollection = this.dbConnection.collection('counters');
            const result = await countersCollection.updateOne({ name: counter }, { $inc: { value: value } });
            this.getAllCountersFromDB();
            return result;
        }
        catch (err) {
            logger.error(`Error in increaseCounter: ${err}`);
        }
    }

    // Method to decrease a counter
    async decreaseCounter(counter, value) {
        try {
            // Decrease the counter in the cache and the database
            const countersCollection = this.dbConnection.collection('counters');
            const result = await countersCollection.updateOne({ name: counter }, { $inc: { value: -value } });
            this.getAllCountersFromDB();
            return result;
        }
        catch (err) {
            logger.error(`Error in decreaseCounter: ${err}`);
        }
    }
}


export default CounterService;

