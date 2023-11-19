import logger from "../utilities/logger.js";
import { getChattersWithoutBots } from '../handlers/twitch/viewTimeHandler.js';
import { cache, usersDB, twitchApi } from '../config/initializers.js';
import NodeCache from 'node-cache';


// Currency Class
class ViewTimeService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.viewTimeCache = new NodeCache( { stdTTL: 300, checkperiod: 60 });
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
                }
                for (const viewer of viewers) {
                    // Check if the viewer is a follower
                    const { userId, userName, userDisplayName } = viewer;
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
                        if (this.viewTimeCache.get(userId) >= this.viewTimeThreshold) {
                            await usersDB.increaseViewTime(userId, this.viewTimeCache.get(userId));
                            this.viewTimeCache.del(userId);
                        }
                    } else {
                        continue;
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
                    }
                    for (const viewer of viewers) {
                        // Check if the viewer is a follower
                        const isFollower = await usersDB.isFollower(viewer.userId);
                        if (isFollower) {
                            // Add them to the view time cache if they are not already there and add 1 minute to their view time. Set the TTL to 15 minutes.
                            const viewTime = this.viewTimeCache.get(viewer.userId);
                            if (!viewTime || viewTime === undefined) {
                                this.viewTimeCache.set(viewer.userId, 1, 300);
                            } else {
                                this.viewTimeCache.set(viewer.userId, viewTime + 1, 300);
                            }
                            console.log(`Increaseing View Time: ${this.viewTimeCache.get(viewer.userId)}`)
                            // Check if the viewer has more than 5 minutes of view time. If they do increase the view time in the database by the amount of view time they have in the cache.
                            if (this.viewTimeCache.get(viewer.userId) >= 5) {
                                await usersDB.increaseViewTime(viewer.userId, this.viewTimeCache.get(viewer.userId));
                                this.viewTimeCache.del(viewer.userId);
                            }
                        } else {
                            continue;
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