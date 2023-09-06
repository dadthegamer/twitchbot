import { ApiClient } from '@twurple/api';
import { writeToLogFile } from '../utilities/logging.js';
import axios from 'axios';

// Class for the Twitch API client
export class TwitchApiClient {
    constructor(authProvider, userId, cache) {
        this.apiClient = new ApiClient({ authProvider: authProvider });
        this.userId = userId;
        this.cache = cache;
    }

    // Method to return the api client
    getApiClient() {
        return this.apiClient;
    }

    // Method to get all the users the channel follows
    async getFollowers() {
        try {
            let followers = [];
            const data = await this.apiClient.channels.getChannelFollowersPaginated(this.userId).getAll();
            for (const follower of data) {
                const d = {
                    id: follower.userId,
                    login: follower.userName,
                    display_name: follower.userDisplayName,
                    follow_date: follower.followDate,
                }
                followers.push(d);
            }
            return followers;
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error getting channel followers: ${error}`);
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
            console.log(error);
            writeToLogFile('error', `Error getting user data by token: ${error}`);
        }
    }

    // Method to get the channel VIP's
    async getChannelVips() {
        try {
            const data = await this.apiClient.channels.getVipsPaginated(this.userId).getAll();
            const vips = data.map((vip) => ({
                id: vip.id,
                display_name: vip.displayName,
            }));
            console.log(vips);
            this.cache.set('channel_vips', vips);
            return vips;
        }
        catch (error) {
            writeToLogFile('error', `Error getting channel VIP's: ${error}`);
        }
    }

    // Method to get all the subscribers to the channel
    async getChannelSubscribers() {
        try {
            const data = await this.apiClient.subscriptions.getSubscriptionsPaginated(this.userId).getAll();
            const subs = data.map((sub) => ({
                id: sub.userId,
                login: sub.userName,
                display_Name: sub.userDisplayName,
                tier: sub.tier,
                is_gift: sub.isGift,
            }));
            this.cache.set('channel_subs', subs);
            return subs;
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error getting channel subscribers: ${error}`);
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
            console.log(error);
            writeToLogFile('error', `Error getting channel moderators: ${error}`);
        }
    }

    // Get user data based off of the user ID
    async getUserDataById(userId) {
        try {
            const data = await this.apiClient.users.getUserById(userId);
            const user = {
                id: data.id,
                login: data.name,
                display_name: data.displayName,
                profile_image_url: data.profilePictureUrl,
            };
            console.log(user);
            return user;
        }
        catch (error) {
            writeToLogFile('error', `Error getting user data: ${error}`);
        }
    }

    // Method to get all the chatter's in the channel
    async getChatters() {
        try {
            let chatters = [];
            const response = await this.apiClient.chat.getChattersPaginated(this.userId).getAll();
            const data = response.map((chatter) => ({
                id: chatter.userId,
                login: chatter.userName,
                display_name: chatter.userDisplayName,
            }));
            chatters = [...chatters, ...data];
            console.log(chatters);
            this.cache.set('chatters', chatters);
            return chatters;
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error getting chatters: ${error}`);
        }
    }

    // Method to send an announcement to the channel
    async sendChannelAnnouncement(message, color = 'primary') {
        try {
            await this.apiClient.chat.sendAnnouncement(this.userId, { message: message, color: color });
        }
        catch (error) {
            writeToLogFile('error', `Error sending channel announcement: ${error}`);
        }
    }

    // Method to shoutout a user in the channel
    async shoutoutUser(userId) {
        try {
            await this.apiClient.chat.shoutoutUser(this.userId, userId);
        }
        catch (error) {
            writeToLogFile('error', `Error shouting out user: ${error}`);
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
            writeToLogFile('error', `Error creating prediction: ${error}`);
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
            writeToLogFile('error', `Error ending prediction: ${error}`);
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
            writeToLogFile('error', `Error getting current prediction: ${error}`);
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
            writeToLogFile('error', `Error canceling prediction: ${error}`);
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
            writeToLogFile('error', `Error creating poll: ${error}`);
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
            writeToLogFile('error', `Error ending poll: ${error}`);
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
            writeToLogFile('error', `Error getting polls: ${error}`);
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
            console.log(error);
            writeToLogFile('error', `Error getting latest poll: ${error}`);
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
            console.log(leaderboard);
            return leaderboard;
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error getting bits leaderboard: ${error}`);
        }
    }
}
