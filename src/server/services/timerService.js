import logger from '../utilities/logger.js';
import { actionEvalulate } from '../handlers/evaluator.js';

// This class manages the timers
class TimerManager {
    constructor(cache, dbConnection) {
        this.cache = cache;
        this.dbConnection = dbConnection;
        this.collectionName = 'timers';
        this.timers = [];
        this.initializeTimers();
    }

    // Get all the timers from the database and add them to the cache
    async initializeTimers() {
        try {
            const timers = await this.dbConnection.getAllDocuments(this.collectionName);
            if (timers === null || timers === undefined) {
                logger.error(`No timers found.`);
                return;
            }
            try {
                for (const timer of timers) {
                    const { name, interval, handlers, enabled, liveOnly } = timer;
                    const timerInterval = setInterval(async () => {
                        if (enabled) {
                            actionEvalulate(handlers);
                        }
                    }, interval);
                    const timer = {
                        name: name,
                        interval: interval,
                        handlers: handlers,
                        intervalId: timerInterval,
                        liveOnly: liveOnly
                    };
                    const timers = this.cache.get('timers');
                    this.cache.set('timers', [...timers, timer]);
                    this.timers.push(timer);
                    logger.info(`Timer ${name} started.`);
                }
            } catch (error) {
                logger.error(`Error adding timer: ${error}`);
            }
        }
        catch (error) {
            logger.error(`Error getting all timers from database: ${error}`);
        }
    }

    // Add a timer to the cache and database
    async createTimer(timerName, interval, handlers) {
        try {
            // Check if the timer already exists
            const timerExists = this.cache.get(timerName);
            if (timerExists) {
                logger.error(`Timer ${timerName} already exists.`);
                return;
            }
            // Check if the interval is a number and is greater than 0
            if (isNaN(interval) || interval <= 0) {
                logger.error(`Interval must be a number greater than 0.`);
                return;
            }
            const timer = {
                name: timerName,
                interval: interval,
                handlers: handlers,
                created: Date.now(),
                enabled: true,
                liveOnly: false
            };
            await this.dbConnection.collection(this.collectionName).insertOne(timer);
            // Add the timer to the timers cache
            const timers = this.cache.get('timers');
            this.cache.set('timers', [...timers, timer])
            logger.info(`Timer ${timerName} created.`);
        } catch (error) {
            logger.error(`Error adding timer: ${error}`);
        }
    }

    // Start a timer using interval and handlers
    async startTimer(timerName, interval, handlers) {
        try {
            const timerInterval = setInterval(async () => {
                actionEvalulate(handlers);
            }, interval);
            const timer = {
                name: timerName,
                interval: interval,
                handlers: handlers,
                intervalId: timerInterval
            };
            this.timers.push(timer);
            logger.info(`Timer ${timerName} started.`);
        }
        catch (error) {
            logger.error(`Error starting timer: ${error}`);
        }
    }
}

export default TimerManager;
