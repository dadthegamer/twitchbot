import NodeCache from 'node-cache';
import { usersDB } from '../config/initializers.js';
import logger from "../utilities/logger.js";

// Class for active users cache
export class ActiveUsersCache {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });
        this.ActiveViewtimeThreshold = 15;
    }

    // Method to return the cache
    async getCache() {
        return this;
    }

    // Method to check if a user is in the cache. If they are not add a user to the cache with a ttl of 5 minutes
    async addUser(userId, displayName) {
        try {
            if (!this.cache.get(userId)) {
                this.cache.set(userId, displayName, this.ActiveViewtimeThreshold * 60);
            } else {
                this.cache.ttl(userId, this.ActiveViewtimeThreshold * 60);
            }
        }
        catch (err) {
            console.log(err);
            logger.error(`Error in adding user to active view time cache: ${err}`);
        }
    }

    // Method to get a user from the cache
    async getUser(userId) {
        return this.cache.get(userId);
    }

    // Method to return all the active users in the cache
    async getActiveViewers() {
        try {
            const keys = this.cache.keys();
            const activeUsers = keys.map(key => {
                return { userId: key, displayName: this.cache.get(key) };
            });
            return activeUsers;
        }
        catch (err) {
            logger.error(`Error in getActiveUsers: ${err}`);
        }
    }

    // Method to delete a user from the cache
    async deleteUser(userId) {
        try {
            this.cache.del(userId);
        }
        catch (err) {
            logger.error(`Error in deleteUser: ${err}`);
        }
    }

    // Method to return a random active user
    async getRandomActiveUser() {
        try {
            const activeUsers = await this.getActiveUsers();
            const randomIndex = Math.floor(Math.random() * activeUsers.length);
            return activeUsers[randomIndex];
        }
        catch (err) {
            logger.error(`Error in getRandomActiveUser: ${err}`);
        }
    }

    // Method to listen for expired keys. When a key expires add the view time to the database and remove the key from the cache.
    listenForExpiredKeys() {
        this.cache.on('expired', (key, value) => {
            this.cache.del(key);
        });
    }
}

export default ActiveUsersCache;