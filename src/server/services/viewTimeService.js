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
        this.viewTimeThreshold = 5;
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
        try {
            setInterval(async () => {
                this.viewTimeHandler();
            }, 60000);
        } catch (err) {
            logger.error(`Error in viewTimeHandlerInterval: ${err}`);
        }
    }

    // Method to handle the view time
    async viewTimeHandler() {
        try {
            if (process.env.NODE_ENV === 'development') {
                const viewers = cache.get('currentViewers');
                if (!viewers || viewers.length === 0 || viewers === undefined) {
                    return;
                } else {
                    for (const viewer of viewers) {
                        const { userId, userName, userDisplayName } = viewer;
                        const isFollower = await usersDB.isFollower(userId);
                        if (isFollower) {
                            console.log(`Viewer: ${userDisplayName}`);
                        } else {
                            continue;
                        }
                    }
                }
            } else {
                const live = cache.get('live');
                if (!live) {
                    return;
                } else {
                    const viewers = cache.get('currentViewers');
                    if (!viewers || viewers.length === 0) {
                        return;
                    } else {
                        for (const viewer of viewers) {
                            const { userId, userName, userDisplayName } = viewer;
                            // Check if the viewer is a follower
                            const isFollower = await usersDB.isFollower(userId);
                            if (isFollower) {
                                // Add them to the view time cache if they are not already there and add 1 minute to their view time. Set the TTL to 15 minutes.
                                const viewTime = this.viewTimeCache.get(userId);
                                if (!viewTime || viewTime === undefined) {
                                    this.viewTimeCache.set(userId, 1, 300);
                                } else {
                                    this.viewTimeCache.set(userId, viewTime + 1, 300);
                                }
                                // Check if the viewer has more than 5 minutes of view time. If they do increase the view time in the database by the amount of view time they have in the cache.
                                if (viewTime >= this.viewTimeThreshold) {
                                    await usersDB.increaseViewTime(userId, viewTime);
                                    this.viewTimeCache.del(userId);
                                }
                            } else {
                                continue;
                            }
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