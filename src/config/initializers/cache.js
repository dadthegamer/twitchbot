import { CacheService } from '../../services/cacheServices.js';

const cache = new CacheService();

cache.set("some_key", "initial_value");


export default cache;