import NodeCache from 'node-cache';
import { usersDB } from '../config/initializers.js';

// Class for active users cache
export class ActiveUsersCache {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });
    }

    // Method to return the cache
    async getCache() {
        return this;
    }

    // Method to check if a user is in the cache. If they are not add a user to the cache with a ttl of 5 minutes
    async addUser(userId, user) {
        if (!this.cache.get(userId)) {
            this.cache.set(userId, user, 300);
        }
    }

    // Method to get a user from the cache
    async getUser(userId) {
        return this.cache.get(userId);
    }

    // Method to return a list of all users in the cache
    async getAllUsers() {
        return this.cache.keys().map(key => this.cache.get(key));
    }

    // Method to delete a user from the cache
    async deleteUser(userId) {
        this.cache.del(userId);
    }

    // Method to return a random user from the cache
    async getRandomActiveUser() {
        const keys = this.cache.keys();
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return this.cache.get(randomKey);
    }

    // Method to listen for expired keys. When a key expires add the view time to the database and remove the key from the cache.
    listenForExpiredKeys() {
        this.cache.on('expired', (key, value) => {
            usersDB.increaseActiveViewTime(key, value);
            this.cache.del(key);
        });
    }
}

export default ActiveUsersCache;