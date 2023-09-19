import NodeCache from 'node-cache';


class CacheService {
    constructor(name, stdTTL = 0) {
        this.name = name;
        this.cache = new NodeCache({ stdTTL, checkperiod: 120 });
    }

    // Method to get a value from the cache
    get(key) {
        return this.cache.get(key);
    }

    // Method to set a value in the cache
    set(key, value) {
        return this.cache.set(key, value);
    }

    // Method to delete a value from the cache
    delete(key) {
        return this.cache.del(key);
    }

    // Method to delete all values from the cache
    flush() {
        return this.cache.flushAll();
    }

    // Method to get all keys from the cache
    getAllKeys() {
        return this.cache.keys();
    }

    // Method to get all keys and values from the cache
    getAll() {
        return this.cache.mget(this.getAllKeys());
    }

    // Method to get all stats from the cache
    getStats() {
        return this.cache.getStats();
    }

    // Method to return the cache
    getCache() {
        return this.cache;
    }

    // Method to get the cache size in megabytes
    getCacheSize() {
        const stats = this.getStats();
        const size = stats.ksize / 1024 / 1024;
        return size;
    }
}


export default CacheService;