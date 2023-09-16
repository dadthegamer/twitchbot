import { twitchApi, cache, db } from '../config/initializers.js';
import logger from '../utilities/logger.js';

// Class to connect to Twitch chat
export class TwitchChannelPointsService {
    constructor(cache, db) {
        this.cache = cache;
        this.dbConnection = dbConnection;
    }

    // Method to get all the channel rewards for a channel, store them in the cache, and update the database
    async getAllChannelRewards() {
        try {
            const channelRewards = await twitchApi.getChannelRewards();
            await this.cache.set('channelRewards', channelRewards);
            await this.dbConnection.collection('channelRewards').insertMany(channelRewards);
        }
        catch (error) {
            logger.error(error);
        }
    }
}
