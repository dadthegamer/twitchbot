import { ApiClient } from '@twurple/api';
import logger from "../utilities/logger.js";
import axios from 'axios';
import { initializerEventListener } from './twitchEventListenerServices.js';

// Class for the Twitch API client
class TwitchApiClient {
    constructor(authProvider, cache) {
        this.apiClient = new ApiClient({ authProvider: authProvider });
        this.userId = '64431397';
        this.cache = cache;
        initializerEventListener(this.apiClient);
        this.getStreamInfo();
    }

    // Method to return the api client
    getApiClient() {
        return this.apiClient;
    }

    // Method to start the event listener
    async startEventListener() {
        startEventListener(this.apiClient);
    }

    // Method to get the current stream information
    async getStreamInfo() {
        try {
            let streamInfo = {};
            const data = await this.apiClient.streams.getStreamByUserId(this.userId);
            if (data === null) {
                this.cache.set('live', false);
                streamInfo = {
                    gameName: 'Just Chatting',
                    title: 'Offline',
                    startDate: null,
                    boxArtURL: 'https://static-cdn.jtvnw.net/ttv-boxart/509658-520x720.jpg',
                };
            } else {
                this.cache.set('live', true);
                const boxart = await data.getThumbnailUrl(520, 720);
                streamInfo = {
                    id: data.id,
                    gameName: data.gameName,
                    gameId: data.gameId,
                    title: data.title,
                    startDate: data.startDate,
                    isMature: data.isMature,
                    tags: data.tags,
                    boxArtURL: boxart,
                };
            }
            this.cache.set('streamInfo', streamInfo);
            return streamInfo;
        }
        catch (error) {
            console.log(error);
            logger.error(`Error getting stream info: ${error}`);
        }
    }

    // Method to get all the users the channel follows
    async getFollowers() {
        try {
            let followers = [];
            const data = await this.apiClient.channels.getChannelFollowersPaginated(this.userId).getAll();
            for (const follower of data) {
                const d = {
                    userId: follower.userId,
                    userName: follower.userName,
                    userDisplayName: follower.userDisplayName,
                    followDate: follower.followDate,
                }
                followers.push(d);
            }
            return followers;
        }
        catch (error) {
            logger.error(`Error getting followers: ${error}`);
        }
    }

    // Method to get user information by token
    async getUserDataByToken(token) {
        try {
            const response = await axios.get('https://api.twitch.tv/helix/users', {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = response.data.data[0];
            return data;
        }
        catch (error) {
            logger.error(`Error getting user data by token: ${error}`);
        }
    }

    // Method to get the channel VIP's
    async getChannelVips() {
        try {
            const data = await this.apiClient.channels.getVipsPaginated(this.userId).getAll();
            const vips = data.map((vip) => ({
                id: vip.id,
                displayName: vip.displayName,
            }));
            this.cache.set('vifps', vips);
            return vips;
        }
        catch (error) {
            logger.error(`Error getting channel VIP's: ${error}`);
        }
    }

    // Method to get all the subscribers to the channel
    async getChannelSubscribers() {
        try {
            const data = await this.apiClient.subscriptions.getSubscriptionsPaginated(this.userId).getAll();
            const subs = data.map((sub) => ({
                userId: sub.userId,
                userName: sub.userName,
                userDisplayName: sub.userDisplayName,
                tier: sub.tier,
                isGift: sub.isGift,
            }));
            this.cache.set('subscribers', subs);
            return subs;
        }
        catch (error) {
            logger.error(`Error getting channel subscribers: ${error}`);
        }
    }

    // Method to get the channel moderators
    async getChannelModerators() {
        try {
            const data = await this.apiClient.moderation.getModerators(this.userId, 100);
            const mods = data.data.map((mod) => ({
                userId: mod.userId,
                username: mod.userName,
                display_name: mod.userDisplayName,
            }));
            this.cache.set('channel_mods', mods);
            return mods;
        }
        catch (error) {
            logger.error(`Error getting channel moderators: ${error}`);
        }
    }

    // Get user data based off of the user ID
    async getUserDataById(userId) {
        try {
            const data = await this.apiClient.users.getUserById(userId);
            const user = {
                id: data.id,
                name: data.name,
                displayName: data.displayName,
                profilePictureUrl: data.profilePictureUrl,
            };
            return user;
        }
        catch (error) {
            logger.error(`Error getting user data by ID: ${error}`);
        }
    }

    // Method to get all the chatter's in the channel
    async getChatters() {
        try {
            let chatters = [];
            const response = await this.apiClient.chat.getChattersPaginated(this.userId).getAll();
            const data = response.map((chatter) => ({
                userId: chatter.userId,
                userName: chatter.userName,
                userDisplayName: chatter.userDisplayName,
            }));
            chatters = [...chatters, ...data];
            return chatters;
        }
        catch (error) {
            console.log(error);
            logger.error(`Error getting chatters: ${error}`);
        }
    }

    // Method to send an announcement to the channel
    async sendChannelAnnouncement(message, color = 'primary') {
        try {
            await this.apiClient.chat.sendAnnouncement(this.userId, { message: message, color: color });
        }
        catch (error) {
            logger.error(`Error sending channel announcement: ${error}`);
        }
    }

    // Method to shoutout a user in the channel
    async shoutoutUser(userId) {
        try {
            await this.apiClient.chat.shoutoutUser(this.userId, userId);
        }
        catch (error) {
            logger.error(`Error shouting out user: ${error}`);
        }
    }

    // Method to create a prediction
    async createPrediction(title, outcomes, predictionWindow = 120) {
        try {
            const data = {
                autoLockAfter: predictionWindow,
                outcomes: outcomes,
                title: title,
            };
            const response = await this.apiClient.predictions.createPrediction(this.userId, data);
            this.cache.set('prediction', predictionData);
            return response;
        }
        catch (error) {
            logger.error(`Error creating prediction: ${error}`);
        }
    }

    // Method to end a prediction
    async endPrediction(outcome) {
        try {
            const outcomeId = this.cache.get('prediction').outcomes.find((o) => o.title === outcome).id;
            const response = await this.apiClient.predictions.resolvePrediction(this.userId, outcomeId);
            this.cache.delete('prediction');
            return response;
        }
        catch (error) {
            logger.error(`Error ending prediction: ${error}`);
        }
    }

    // Method to get the current prediction
    async getCurrentPrediction() {
        try {
            const data = await this.apiClient.predictions.getPredictions(this.userId);
            const prediction = data.data[0];
            const predictionData = {
                id: prediction.id,
                title: prediction.title,
                outcomes: prediction.outcomes.map((outcome) => ({
                    id: outcome.id,
                    color: outcome.color,
                    title: outcome.title,
                    users: outcome.users,
                    channel_points: outcome.totalChannelPoints,
                    top_predictors: outcome.topPredictors.map((predictor) => ({
                        user_id: predictor.userId,
                        user_name: predictor.userName,
                        display_name: predictor.userDisplayName,
                        channel_points_used: predictor.channelPointsUsed,
                        channel_points_won: predictor.channelPointsWon,
                    })),
                })),
                started_at: prediction.startDate,
                duration: prediction.durationInSeconds,
                status: prediction.status,
            };
            this.cache.set('prediction', predictionData);
            return predictionData;
        }
        catch (error) {
            console.log(error);
            logger.error(`Error getting current prediction: ${error}`);
        }
    }

    // Method to cancel a prediction
    async cancelPrediction() {
        try {
            const predictionId = this.cache.get('prediction').id;
            const response = await this.apiClient.predictions.cancelPrediction(this.userId, predictionId);
            this.cache.delete('prediction');
            return response;
        }
        catch (error) {
            logger.error(`Error canceling prediction: ${error}`);
        }
    }

    // Method to create a poll
    async createPoll(title, choices, duration = 120) {
        try {
            const data = {
                title: title,
                choices: choices,
                duration: duration,
            };
            const response = await this.apiClient.polls.createPoll(this.userId, data);
            this.cache.set('poll', response);
            return response;
        }
        catch (error) {
            logger.error(`Error creating poll: ${error}`);
        }
    }

    // Method to end a poll
    async endPoll() {
        try {
            const pollData = await this.getLatestPoll();
            const response = await this.apiClient.polls.endPoll(this.userId, pollData.id);
            this.cache.delete('poll');
            return response;
        }
        catch (error) {
            logger.error(`Error ending poll: ${error}`);
        }
    }

    // Method to get a list of polls
    async getPolls() {
        try {
            const data = await this.apiClient.polls.getPolls(this.userId);
            const polls = data.data;
            return polls;
        }
        catch (error) {
            logger.error(`Error getting polls: ${error}`);
        }
    }

    // Method to get the latest poll
    async getLatestPoll() {
        try {
            const data = await this.getPolls();
            const latestPoll = data[0];
            const choices = latestPoll.choices.map((choice) => ({
                id: choice.id,
                title: choice.title,
                votes: choice.totalVotes,
            }));
            const pollData = {
                id: latestPoll.id,
                title: latestPoll.title,
                choices,
            };
            return pollData;
        }
        catch (error) {
            logger.error(`Error getting latest poll: ${error}`);
        }
    }

    // Method to get the bits leaderboard
    async getBitsLeaderboard() {
        try {
            const data = await this.apiClient.bits.getLeaderboard(this.userId, {
                period: 'all',
                count: 100,
            });
            const leaderboard = data.entries.map((entry) => ({
                rank: entry.rank,
                displayName: entry.userDisplayName,
                userId: entry.userId,
                amount: entry.amount,
            }));
            return leaderboard;
        }
        catch (error) {
            logger.error(`Error getting bits leaderboard: ${error}`);
        }
    }

    // Method to get all the channel rewards
    async getChannelRewards() {
        try {
            const data = await this.apiClient.channelPoints.getCustomRewards(this.userId);
            const rewards = data.map((reward) => ({
                id: reward.id,
                title: reward.title,
                prompt: reward.prompt,
                cost: reward.cost,
                isEnabled: reward.isEnabled,
                userInputRequired: reward.userInputRequired,
                maxRedemptionsPerStream: reward.maxRedemptionsPerStream,
                maxRedemptionsPerUserPerStream: reward.maxRedemptionsPerUserPerStream,
                globalCooldown: reward.globalCooldown,
                isPaused: reward.isPaused,
                isInStock: reward.isInStock,
                backgroundColor: reward.backgroundColor,
                autoFulfill: reward.autoFulfill,
                redemptionsThisStream: reward.redemptionsThisStream,
                cooldownExpiryDate: reward.cooldownExpiryDate,
            }));
            return rewards;
        }
        catch (error) {
            logger.error(`Error getting channel rewards: ${error}`);
        }
    }

    // Method to get only the channel rewards that can be managed by this bot
    async getChannelRewardsManaged() {
        try {
            const data = await this.apiClient.channelPoints.getCustomRewards(this.userId, true);
            const rewards = data.map((reward) => ({
                id: reward.id,
                title: reward.title,
                prompt: reward.prompt,
                cost: reward.cost,
                isEnabled: reward.isEnabled,
                userInputRequired: reward.userInputRequired,
                maxRedemptionsPerStream: reward.maxRedemptionsPerStream,
                maxRedemptionsPerUserPerStream: reward.maxRedemptionsPerUserPerStream,
                globalCooldown: reward.globalCooldown,
                isPaused: reward.isPaused,
                isInStock: reward.isInStock,
                backgroundColor: reward.backgroundColor,
                autoFulfill: reward.autoFulfill,
                redemptionsThisStream: reward.redemptionsThisStream,
                cooldownExpiryDate: reward.cooldownExpiryDate,
            }));
            return rewards;
        }
        catch (error) {
            logger.error(`Error getting channel rewards managed: ${error}`);
        }
    }

    // Method to get a custom reward by ID
    async getCustomRewardById(rewardId) {
        try {
            const data = await this.apiClient.channelPoints.getCustomRewardById(this.userId, rewardId);
            const reward = {
                id: data.id,
                title: data.title,
                prompt: data.prompt,
                cost: data.cost,
                isEnabled: data.isEnabled,
                userInputRequired: data.userInputRequired,
                maxRedemptionsPerStream: data.maxRedemptionsPerStream,
                maxRedemptionsPerUserPerStream: data.maxRedemptionsPerUserPerStream,
                globalCooldown: data.globalCooldown,
                isPaused: data.isPaused,
                isInStock: data.isInStock,
                backgroundColor: data.backgroundColor,
                autoFulfill: data.autoFulfill,
                redemptionsThisStream: data.redemptionsThisStream,
                cooldownExpiryDate: data.cooldownExpiryDate,
            };
            return reward;
        }
        catch (error) {
            logger.error(`Error getting custom reward by ID: ${error}`);
        }
    }

    // Method to update a custom reward
    async updateCustomReward(rewardId, data) {
        // Check if reward ID is in the managed rewards cache. If it isnt then return an error
        const managedRewards = this.cache.get('managedChannelRewards');
        const reward = managedRewards.find((r) => r.id === rewardId);
        if (!reward) {
            logger.error(`Error updating custom reward: Reward ID ${rewardId} is not managed by this bot`);
            return;
        }
        try {
            const response = await this.apiClient.channelPoints.updateCustomReward(this.userId, rewardId, data);
            return response;
        }
        catch (error) {
            logger.error(`Error updating custom reward: ${error}`);
        }
    }

    // Method to create a custom reward
    async createCustomReward(data) {
        try {
            const response = await this.apiClient.channelPoints.createCustomReward(this.userId, data);
            const reward = {
                id: response.id,
                title: response.title,
                prompt: response.prompt,
                cost: response.cost,
                isEnabled: response.isEnabled,
                userInputRequired: response.userInputRequired,
                maxRedemptionsPerStream: response.maxRedemptionsPerStream,
                maxRedemptionsPerUserPerStream: response.maxRedemptionsPerUserPerStream,
                globalCooldown: response.globalCooldown,
                isPaused: response.isPaused,
                isInStock: response.isInStock,
                backgroundColor: response.backgroundColor,
                autoFulfill: response.autoFulfill,
                redemptionsThisStream: response.redemptionsThisStream,
                cooldownExpiryDate: response.cooldownExpiryDate,
            };
            return reward;
        }
        catch (error) {
            // Parse the error message to see if the error is because the reward already exists
            if (error.message.includes('CREATE_CUSTOM_REWARD_DUPLICATE_REWARD')) {
                return { error: 'Reward already exists' }
            } else {
                console.log(error);
                logger.error(`Error creating custom reward: ${error}`);
            }
        }
    }

    // Method to delete a custom reward
    async deleteCustomReward(rewardId) {
        try {
            const response = await this.apiClient.channelPoints.deleteCustomReward(this.userId, rewardId);
            return response;
        }
        catch (error) {
            logger.error(`Error deleting custom reward: ${error}`);
        }
    }

    // Method to get the hype train information
    async getHypeTrain() {
        try {
            const data = await this.apiClient.hypeTrain.getHypeTrainEventsForBroadcasterPaginated(this.userId).getAll();
            const hypeTrain = {
                id: data.id,
                level: data.level,
                total: data.total,
                expiryDate: data.expiryDate,
                goal: data.goal,
                topContributions: data.topContributions,
                lastContribution: data.lastContribution,
                startDate: data.startDate,
                endDate: data.endDate,
            };
            return hypeTrain;
        }
        catch (error) {
            logger.error(`Error getting hype train: ${error}`);
        }
    }

    // Method to create a clip
    async createClip() {
        try {
            const data = await this.apiClient.clips.createClip({ channel: this.userId });
            return data;
        }
        catch (error) {
            logger.error(`Error creating clip: ${error}`);
        }
    }

    // Method to get a random clip from a channel
    async getRandomClip(userId) {
        try {
            let clips = [];
            const response = await this.apiClient.clips.getClipsForBroadcasterPaginated(userId).getAll();
            const data = response.map((clip) => ({
                id: clip.id,
                title: clip.title,
                url: clip.url,
                thumbnailUrl: clip.thumbnailUrl,
                views: clip.views,
                duration: clip.duration,
                creationDate: clip.creationDate,
            }));
            clips = [...clips, ...data];
            const clip = clips[Math.floor(Math.random() * clips.length)];
            console.log(clip);
            return clip;
        }
        catch (error) {
            console.log(error);
            logger.error(`Error getting random clip: ${error}`);
        }
    }
}


export default TwitchApiClient;