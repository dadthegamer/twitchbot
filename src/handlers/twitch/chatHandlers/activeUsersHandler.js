import { writeToLogFile } from "../../../utilities/logging.js";
import NodeCache from 'node-cache';


// Class to handle active users
export class ActiveUsersHandler {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 10, checkperiod: 300 });
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
            this.cache.set(userId, { displayName, color, user }, 10);
        }
        catch (err) {
            writeToLogFile('error', `Error in addActiveUser: ${err}`)
            console.error('Error in addActiveUser:', err);
        }
    }

    // Method to remove an active user from the cache
    removeActiveUser(userId) {
        try {
            this.cache.del(userId);
        }
        catch (err) {
            writeToLogFile('error', `Error in removeActiveUser: ${err}`)
            console.error('Error in removeActiveUser:', err);
        }
    }

    // Method to get an active user from the cache
    getActiveUser(userId) {
        try {
            return this.cache.get(userId);
        }
        catch (err) {
            writeToLogFile('error', `Error in getActiveUser: ${err}`)
            console.error('Error in getActiveUser:', err);
        }
    }

    // Method to get all active users from the cache
    getAllActiveUsers() {
        try {
            return this.cache.mget(this.cache.keys());
        }
        catch (err) {
            writeToLogFile('error', `Error in getAllActiveUsers: ${err}`)
            console.error('Error in getAllActiveUsers:', err);
        }
    }

    // Method to flush the cache
    flush() {
        try {
            this.cache.flushAll();
        }
        catch (err) {
            writeToLogFile('error', `Error in flush: ${err}`)
            console.error('Error in flush:', err);
        }
    }

    // Get the ttl for a key
    getTtl(key) {
        try {
            return this.cache.getTtl(key);
        }
        catch (err) {
            writeToLogFile('error', `Error in getTtl: ${err}`)
            console.error('Error in getTtl:', err);
        }
    }
    
}