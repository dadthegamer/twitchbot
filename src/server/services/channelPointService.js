import { channelPointsService, twitchApi } from '../config/initializers.js';
import logger from '../utilities/logger.js';
import { evalulate } from '../handlers/evaluater.js';

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
                if (channelReward) {
                    channelReward.managed = true;
                }
            }
            // For each channel reward insert it into the database if it does not exist
            for (const channelReward of channelRewards) {
                channelReward.handlers = [];
                const channelRewardExists = await this.dbConnection.collection(this.collectionName).findOne({ id: channelReward.id });
                if (!channelRewardExists) {
                    await this.dbConnection.collection(this.collectionName).insertOne(channelReward);
                }
            }

            // Now get all the channel rewards from the database and remove any channel rewards that are not in the Twitch api
            const channelRewardsFromDatabase = await this.dbConnection.collection(this.collectionName).find().toArray();
            for (const channelRewardFromDatabase of channelRewardsFromDatabase) {
                const channelReward = channelRewards.find(channelReward => channelReward.id === channelRewardFromDatabase.id);
                if (!channelReward) {
                    await this.dbConnection.collection(this.collectionName).deleteOne({ id: channelRewardFromDatabase.id });
                }
            }
            // Cache the channel rewards
            this.cache.set('channelRewards', channelRewards);
            this.cache.set('managedChannelRewards', managedChannelRewards);
        }
        catch (error) {
            logger.error(`Error getting channel rewards in TwitchChannelPointsService: ${error}`);
        }
    }

    // Method to get all the channel rewards from the cache if they exist, otherwise get them from the database and cache them
    async getChannelRewards() {
        try {
            let channelRewards = this.cache.get('channelRewards');
            if (!channelRewards) {
                channelRewards = await this.dbConnection.collection(this.collectionName).find().toArray();
                this.cache.set('channelRewards', channelRewards);
            }
            return channelRewards;
        }
        catch (error) {
            logger.error(`Error getting channel rewards in TwitchChannelPointsService: ${error}`);
        }
    }

    // Method to get a channel reward by the id
    async getChannelRewardById(id) {
        try {
            const channelRewards = this.cache.get('channelRewards');
            const channelReward = channelRewards.find(channelReward => channelReward.id === id);
            return channelReward;
        }
        catch (error) {
            logger.error(`Error getting channel reward in TwitchChannelPointsService: ${error}`);
        }
    }

    // Method to create a new channel reward
    async createCustomReward(title, prompt, cost, userInputRequired, backgroundColor, globalCooldown, maxRedemptionsPerStream, maxRedemptionsPerUserPerStream, handlers, autoFill = true, isEnabled = true,) {
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
                const rewardData = {
                    title: channelReward.title,
                    prompt: channelReward.prompt,
                    cost: channelReward.cost,
                    backgroundColor: channelReward.backgroundColor,
                    globalCooldown: channelReward.globalCooldown,
                    maxRedemptionsPerStream: channelReward.maxRedemptionsPerStream,
                    maxRedemptionsPerUserPerStream: channelReward.maxRedemptionsPerUserPerStream,
                }
                // Add the new channel reward to the cache
                const channelRewards = this.cache.get('channelRewards');
                channelReward.handlers = handlers;
                channelRewards.push(channelReward);
                this.cache.set('channelRewards', channelRewards);

                // Add the new channel reward to the database with the managed property set to true
                await this.dbConnection.collection(this.collectionName).insertOne({ ...channelReward, managed: true });
            }
            return { channelReward: channelReward };
        }
        catch (error) {
            console.log(error);
            logger.error(`Error creating custom reward in TwitchChannelPointsService: ${error}`);
            return { error: error };
        }
    }

    // Method to delete a channel reward by a specific id
    async deleteChannelReward(id) {
        try {
            // Get the channel reward from the cache
            const managedRewards = this.cache.get('managedChannelRewards');
            // Find the channel reward by the id passed in and get the id of the channel reward
            const channelReward = managedRewards.find(channelReward => channelReward.id === id);
            if (!channelReward) {
                return;
            } else {
                const channelRewards = this.cache.get('channelRewards');
                // Delete the channel reward from the cache
                this.cache.set('channelRewards', channelRewards.filter(channelReward => channelReward.id !== id));
                // Delete the channel reward from the database
                await this.dbConnection.collection(this.collectionName).deleteOne({ id: id });
                // Delete the channel reward from Twitch
                await twitchApi.deleteCustomReward(id);
            }
        }
        catch (error) {
            console.log(error);
            logger.error(`Error deleting custom reward in TwitchChannelPointsService: ${error}`);
        }
    }

    // Method to update a channel reward
    async updateChannelReward(id, autoFill = true, backgroundColor, cost, globalCooldown, isEnabled = true, maxRedemptionsPerStream, maxRedemptionsPerUserPerStream, prompt, title, userInputRequired) {
        try {
            // Get the channel reward from the cache
            const channelRewards = this.cache.get('channelRewards');
            // Find the channel reward by the id passed in and get the id of the channel reward
            const channelReward = channelRewards.find(channelReward => channelReward.id === id);
            // Update the channel reward in the cache
            const updatedChannelReward = await twitchApi.updateChannelReward(id, { autoFill, backgroundColor, cost, globalCooldown, isEnabled, maxRedemptionsPerStream, maxRedemptionsPerUserPerStream, prompt, title, userInputRequired });
            // Update the channel reward in the cache
            this.cache.set('channelRewards', channelRewards.map(channelReward => channelReward.id === id ? updatedChannelReward : channelReward));
            // Update the channel reward in the database
            await this.dbConnection.collection(this.collectionName).updateOne({ id: id }, { $set: { ...updatedChannelReward } });
        }
        catch (error) {
            logger.error(`Error updating custom reward in TwitchChannelPointsService: ${error}`);
        }
    }

    // Method to toogle a channel reward on or off
    async toggleChannelReward(id, isEnabled) {
        try {
            // Get the channel reward from the cache
            const channelRewards = this.cache.get('channelRewards');
            // Find the channel reward by the id passed in and get the id of the channel reward
            const channelReward = channelRewards.find(channelReward => channelReward.id === id);
            // Update the channel reward in the cache
            const updatedChannelReward = await twitchApi.updateCustomReward(id, { isEnabled });
            // Update the channel reward in the cache
            this.cache.set('channelRewards', channelRewards.map(channelReward => channelReward.id === id ? updatedChannelReward : channelReward));
            // Update the channel reward in the database
            await this.dbConnection.collection(this.collectionName).updateOne({ id: id }, { $set: { ...updatedChannelReward } });
        }
        catch (error) {
            console.log(error);
            logger.error(`Error toggling custom reward in TwitchChannelPointsService: ${error}`);
        }
    }

    // Method to handle a channel reward redemption
    async handleRewardRedemption(rewardId, userId, userDisplayName, userInput) {
        try {
            // Get all the channel rewards from the cache
            const channelRewards = this.cache.get('channelRewards');
            // Find the channel reward by the rewardId passed in
            const channelReward = channelRewards.find(channelReward => channelReward.id === rewardId);
            // If the channel reward does not exist return
            if (!channelReward) {
                return;
            } else {
                const handlers = channelReward.handlers;
                if (!handlers) {
                    return;
                } else {
                    // For each handler evaluate the handler
                    for (const handler of handlers) {
                        await this.evalulate(handler, { userId, userDisplayName, userInput });
                    }
                }
            }
        }
        catch (error) {
            logger.error(`Error handling reward redemption in TwitchChannelPointsService: ${error}`);
        }
    }
}


export default TwitchChannelPointsService;