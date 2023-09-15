import logger from "../utilities/logger.js";
import { getChattersWithoutBots } from '../handlers/twitch/viewTimeHandler.js';
import { currencyDB, usersDB } from '../config/initializers.js';
import NodeCache from 'node-cache';

// Currency Class
export class ViewTimeService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.viewTimeCache = new NodeCache();
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

    // Method to get the current viewers in chat
    async getCurrentViewers() {
        try {
            const chatters = await getChattersWithoutBots();
            this.cache.set('currentViewers', chatters);
            return chatters;
        } catch (err) {
            logger.error(`Error in getCurrentViewers: ${err}`);
        }
    }

    // Method to get the current viewers in chat every minute
    async viewTimeHandlerInterval() {
        try {
            setInterval(async () => {
                await this.getCurrentViewers();
                this.viewTimeHandler();
            }, 60000);
        } catch (err) {
            logger.error(`Error in viewTimeHandlerInterval: ${err}`);
        }
    }

    // Method to handle the view time
    async viewTimeHandler() {
        try {
            const live = this.cache.get('live');
            if (!live) {
                return;
            };
            const viewers = this.cache.get('currentViewers');
            for (const viewer of viewers) {
                // Check if the viewer is a follower
                const isFollower = usersDB.isFollower(viewer.userId);
                if (isFollower) {
                    // Add them to the view time cache if they are not already there and add 1 minute to their view time. Set the TTL to 15 minutes.
                    const viewTime = this.viewTimeCache.get(viewer.userId);
                    if (!viewTime) {
                        this.viewTimeCache.set(viewer.userId, 1, 900);
                    } else {
                        this.viewTimeCache.set(viewer.userId, viewTime + 1, 900);
                    }
                    // Check if the viwer has more than 15 minutes of view time. If they do increase the view time in the database by the amount of view time they have in the cache.
                    if (this.viewTimeCache.get(viewer.userId) >= 15) {
                        const user = currencyDB.getUser(viewer.userId);
                        await usersDB.increaseViewTime(user, this.viewTimeCache.get(viewer.userId));
                        this.viewTimeCache.del(viewer.userId);
                    }
            }
        }
    } catch (err) {
        logger.error(`Error in viewTimeHandler: ${err}`);
    }}
}