import { writeToLogFile } from '../utilities/logging.js';
import { twitchApi } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';

// User class 
export class UpdateService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
    }