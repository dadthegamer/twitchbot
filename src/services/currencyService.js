import { writeToLogFile } from '../utilities/logging.js';
import NodeCache from 'node-cache';


// Currency Class
export class Currency {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.cache = new NodeCache();
        this.listenForExpiredKeys();
    }
}