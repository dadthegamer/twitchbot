import NodeCache from 'node-cache';
import logger from '../../../utilities/logger.js';

// Class to handle active users
class ActiveUsersHandler {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 900, checkperiod: 60 });
        this.listenForExpiredKeys();
    }

    // Method to listen for expired keys
    listenForExpiredKeys() {
        this.cache.on('expired', (key, value) => {
            this.removeActiveUser(key);
        });
    }

    // Method to add an active user to the cache
    addActiveUser(userId, displayName, color, user) {
        try {
            this.cache.set(userId, { displayName, color, user }, 900);
        }
        catch (err) {
            logger.error(`Error in addActiveUser: ${err}`);
        }
    }

    // Method to remove an active user from the cache
    removeActiveUser(userId) {
        try {
            this.cache.del(userId);
        }
        catch (err) {
            logger.error(`Error in removeActiveUser: ${err}`);
        }
    }

    // Method to get an active user from the cache
    getActiveUser(userId) {
        try {
            return this.cache.get(userId);
        }
        catch (err) {
            logger.error(`Error in getActiveUser: ${err}`);
        }
    }

    // Method to get all active users from the cache
    getAllActiveUsers() {
        try {
            return this.cache.mget(this.cache.keys());
        }
        catch (err) {
            logger.error(`Error in getAllActiveUsers: ${err}`);
        }
    }

    // Method to flush the cache
    flush() {
        try {
            this.cache.flushAll();
        }
        catch (err) {
            logger.error(`Error in flush: ${err}`);
        }
    }

    // Get the ttl for a key
    getTtl(key) {
        try {
            return this.cache.getTtl(key);
        }
        catch (err) {
            logger.error(`Error in getTtl: ${err}`);
        }
    }
    
}

export default ActiveUsersHandler;