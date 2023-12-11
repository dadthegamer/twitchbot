import logger from '../utilities/logger.js';
import { actionEvalulate } from '../handlers/evaluator.js';
import { cache } from '../config/initializers.js';

// This class manages the timers
class TimerManager {
    constructor(dbConnection, cache) {
        this.cache = cache;
        this.dbConnection = dbConnection;
        this.collectionName = 'timers';
        this.initializeTimers();
        this.timers = [];
    }

    // Get all the timers from the database and add them to the cache
    async initializeTimers() {
        try {
            this.cache.set('timers', []);
            const timers = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            if (timers === null || timers === undefined) {
                logger.error(`No timers found.`);
                return;
            }
            try {
                for (const timerConfig of timers) {
                    const { name, interval, handlers, enabled, liveOnly, time } = timerConfig;
                    let timerInterval;
                    if (time === "ms") {
                        timerInterval = setInterval(async () => {
                            if (enabled) {
                                const live = cache.get('live');
                                if (liveOnly && !live) {
                                    return;
                                } else {
                                    for (const handler of handlers) {
                                        await actionEvalulate(handler);
                                    }
                                }
                            }
                        }, interval);
                    } else if (time === "seconds") {
                        timerInterval = setInterval(async () => {
                            if (enabled) {
                                const live = this.cache.get('live');
                                if (liveOnly && !live) {
                                    return;
                                } else {
                                    for (const handler of handlers) {
                                        await actionEvalulate(handler);
                                    }
                                }
                            }
                        }, interval * 1000);
                    } else if (time === "minutes") {
                        timerInterval = setInterval(async () => {
                            if (enabled) {
                                const live = this.cache.get('live');
                                if (liveOnly && !live) {
                                    return;
                                } else {
                                    for (const handler of handlers) {
                                        await actionEvalulate(handler);
                                    }
                                }
                            }
                        }, interval * 1000 * 60);
                    } else if (time === "hours") {
                        timerInterval = setInterval(async () => {
                            if (enabled) {
                                const live = this.cache.get('live');
                                if (liveOnly && !live) {
                                    return;
                                } else {
                                    for (const handler of handlers) {
                                        await actionEvalulate(handler);
                                    }
                                }
                            }
                        }, interval * 1000 * 60 * 60);
                    } else {
                        console.log(`Time type not found: ${time}`);
                        logger.error(`Time type not found: ${time}`);
                    }
                    const newTimer = {
                        name: name,
                        interval: interval,
                        handlers: handlers,
                        intervalId: timerInterval,
                        liveOnly: liveOnly
                    };
                    const timers = this.cache.get('timers');
                    this.cache.set('timers', [...timers, newTimer]);
                    this.timers.push(newTimer);
                    logger.info(`Timer ${name} started.`);
                }
            } catch (error) {
                console.log(error);
                logger.error(`Error adding timer: ${error}`);
            }
        }
        catch (error) {
            console.log(error);
            logger.error(`Error getting all timers from database: ${error}`);
        }
    }

    // Add a timer to the cache and database
    async createTimer(timerName, interval, handlers) {
        try {
            // Check if the timer already exists
            const timerExists = await this.dbConnection.documentExists(this.collectionName, { name: timerName });
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
