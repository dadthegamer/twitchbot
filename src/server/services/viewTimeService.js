import logger from "../utilities/logger.js";
import { cache, usersDB } from '../config/initializers.js';
import NodeCache from 'node-cache';


// Currency Class
class ViewTimeService {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.viewTimeCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });
        this.viewTimeHandlerInterval();
        this.listenForExpiredKeys();
    }

    // Method to listen for expired keys. When a key expires add the view time to the database and remove the key from the cache.
    listenForExpiredKeys() {
        this.viewTimeCache.on('expired', (key, value) => {
            usersDB.increaseViewTime(key, value);
            this.viewTimeCache.del(key);
        });
    }

    // Method to get the current viewers in chat every minute
    async viewTimeHandlerInterval() {
        const intervalFunction = async () => {
            try {
                await this.viewTimeHandler();
            } catch (err) {
                logger.error(`Error in viewTimeHandlerInterval: ${err}`);
            } finally {
                setTimeout(intervalFunction, 60000);
            }
        };
        intervalFunction();
    }

    // Method to handle the view time
    async viewTimeHandler() {
        try {
            const threshold = 5;
            let userIdsToUpdate = [];
            if (process.env.NODE_ENV === 'development') {
                const viewers = cache.get('currentViewers');
                if (!viewers || viewers.length === 0 || viewers === undefined) {
                    return;
                } else {
                    viewers.forEach(async viewer => {
                        const { userId, userDisplayName } = viewer;
                        console.log(`User: ${userDisplayName} - ${userId}`);
                    });
                }
            } else {
                const live = cache.get('live');
                if (!live) {
                    return;
                } else {
                    const viewers = cache.get('currentViewers');
                    if (viewers === undefined || viewers.length === 0) {
                        return;
                    } else {
                        viewers.forEach(async viewer => {
                            try {
                                const { userId } = viewer;
                                const viewTime = this.viewTimeCache.get(userId) || 0;
                                this.viewTimeCache.set(userId, viewTime + 1, 300);

                                if (viewTime >= threshold) {
                                    userIdsToUpdate.push(userId);
                                    // Set the view time back to 0
                                    this.viewTimeCache.set(userId, 0, 300);
                                }
                            }
                            catch (err) {
                                logger.error(`Error in increasing view time in viewTimeHandler: ${err}`);
                            }
                        });
                        if (userIdsToUpdate.length > 0) {
                            await usersDB.increaseViewTimeForUsers(userIdsToUpdate, threshold);
                            userIdsToUpdate = [];
                        }
                    }
                }
            }
        } catch (err) {
            logger.error(`Error in viewTimeHandler: ${err}`);
        }
    }
}

export default ViewTimeService;