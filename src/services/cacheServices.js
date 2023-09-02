import NodeCache from 'node-cache';
import { writeToLogFile } from '../utils/logging.js';


export class CacheService  extends NodeCache{
    constructor() {
        super();
        console.log('Cache service started');
    }

    // Method to return the cache
    async getCache() {
        return this;
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
}
