import NodeCache from 'node-cache';

// Class for active users cache
export class ActiveUsersCache {
    constructor() {
        this.cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });
    }

    // Method to return the cache
    async getCache() {
        return this;
    }

    // Method to add a user to the cache with a ttl. 
    // If the user already exists, the ttl is updated
    async addUser(userId, ttl = 15) {
        this.cache.set(userId, userId, ttl);
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
}

export default ActiveUsersCache;