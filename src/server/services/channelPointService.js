import { twitchApi } from '../config/initializers.js';
import logger from '../utilities/logger.js';

// Class to connect to Twitch chat
class TwitchChannelPointsService {
    constructor(cache, dbConnection) {
        this.cache = cache;
        this.dbConnection = dbConnection;
        this.collectionName = 'channelRewards';
        this.getAllChannelRewards();
    }

    // Method to get all the channel rewards for a channel, store them in the cache, and update the database
    async getAllChannelRewards() {
        try {
            const channelRewards = await twitchApi.getChannelRewards();
            // Get all the channel rewards that are managed by the bot
            const managedChannelRewards = await twitchApi.getChannelRewardsManaged();

            // For all the channel rewards that are managed by the bot assing a property to the channel reward object of managed to true
            for (const managedChannelReward of managedChannelRewards) {
                const channelReward = channelRewards.find(channelReward => channelReward.id === managedChannelReward.id);
                channelReward.managed = true;
            }

            // for each channel reward insert it into the database if it does not exist
            for (const channelReward of channelRewards) {
                const channelRewardExists = await this.dbConnection.collection(this.collectionName).findOne({ id: channelReward.id });
                if (!channelRewardExists) {
                    await this.dbConnection.collection(this.collectionName).insertOne(channelReward);
                }
            }

            // Cache the channel rewards
            this.cache.set('channelRewards', channelRewards);
        }
        catch (error) {
            logger.error(`Error getting channel rewards in TwitchChannelPointsService: ${error}`);
        }
    }

    // Method to get all the channel rewards from the database
    async getAllChannelRewardsFromDatabase() {
        try {
            const channelRewards = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            return channelRewards;
        }
        catch (error) {
            logger.error(`Error getting channel rewards from database in TwitchChannelPointsService: ${error}`);
            return { error: error };
        }
    }

    // Method to create a new channel reward
    async createCustomReward(autoFill = true, backgroundColor, cost, globalCooldown, isEnabled = true, maxRedemptionsPerStream, maxRedemptionsPerUserPerStream, prompt, title, userInputRequired) {
        try {
            // Check if the reward already exists. Convert name to lowercase to make sure the name is not case sensitive
            const channelRewards = this.cache.get('channelRewards');
            const channelRewardExists = channelRewards.find(channelReward => channelReward.title.toLowerCase() === title.toLowerCase());
            if (channelRewardExists) {
                logger.error(`Error creating custom reward in TwitchChannelPointsService: ${title} already exists`);
                return;
            }
            const channelReward = await twitchApi.createCustomReward({ autoFill, backgroundColor, cost, globalCooldown, isEnabled, maxRedemptionsPerStream, maxRedemptionsPerUserPerStream, prompt, title, userInputRequired });
            if (channelReward) {
                // Add the new channel reward to the cache
                const channelRewards = this.cache.get('channelRewards');
                channelRewards.push(channelReward);
                this.cache.set('channelRewards', channelRewards);

                // Add the new channel reward to the database with the managed property set to true
                await this.dbConnection.collection(this.collectionName).insertOne({ ...channelReward, managed: true });
            }
            return { channelReward: channelReward };
        }
        catch (error) {
            logger.error(`Error creating custom reward in TwitchChannelPointsService: ${error}`);
            return { error: error };
        }
    }

    // Method to delete a channel reward by a name
    async deleteCustomRewardByName(name) {
        try {
            // Get the channel reward from the cache
            const channelRewards = this.cache.get('channelRewards');
            // Find the channel reward by the name passed in and get the id of the channel reward. Convert the name to lowercase to make sure the name is not case sensitive
            const channelRewardId = channelRewards.find(channelReward => channelReward.title.toLowerCase() === name.toLowerCase()).id;
            // Delete the channel reward from the cache
            this.cache.set('channelRewards', channelRewards.filter(channelReward => channelReward.title.toLowerCase() !== name.toLowerCase()));
            // Delete the channel reward from twitch
            await twitchApi.deleteCustomReward(channelRewardId);
            // Delete the channel reward from the database
            await this.dbConnection.collection(this.collectionName).deleteOne({ id: channelRewardId });
        }
        catch (error) {
            logger.error(`Error deleting custom reward in TwitchChannelPointsService: ${error}`);
        }
    }
}


export default TwitchChannelPointsService;