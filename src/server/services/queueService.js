import logger from "../utilities/logger.js";
import { actionEvalulate } from '../handlers/evaluator.js';
import NodeCache from 'node-cache';


class QueueService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
    }
}