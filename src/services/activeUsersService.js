import NodeCache from 'node-cache';

// Class for active users cache
export class ActiveUsersCache extends NodeCache {
    constructor() {
        super();
        console.log('Active users cache started');
        this.listenForExpiredKeys();
    }

    // Method to return the cache
    async getCache() {
        return this;
    }

    // Method to return the cache stats
    async getCacheStats() {
        return this.getStats();
    }

    // Method to return the cache keys
    async getCacheKeys() {
        return this.keys();
    }

    // Method to return the cache values
    async getCacheValues() {
        return this.values();
    }

    // Set a value in the cache
    set(key, value, ttl = 0) {
        if (ttl === 0) {
            super.set(key, value);
        } else {
            super.set(key, value, ttl);
        }
    }

    // Get a value from the cache
    async getKey(key) {
        return this.cache.get(key);
    }

    // Delete a value from the cache
    async DeleteKey(key) {
        this.del(key);
    }

    // Check if a key exists in the cache
    async has(key) {
        return this.has(key);
    }

    // Flush the entire cache
    async flushCache() {
        this.flushAll();
    }

    // Listen for expired keys
    listenForExpiredKeys() {
        this.on('expired', (key, value) => {
            console.log(`Key ${key} expired`);
            this.delete(key);
        });
    }
}