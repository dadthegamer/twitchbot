import { ApiClient } from '@twurple/api';
import { writeToLogFile } from '../utils/logging.js';

// Class for the Twitch API client
export class TwitchApiClient {
    constructor(authProvider, userId) {
        this.apiClient = new ApiClient({ authProvider: authProvider });
        this.userId = userId;
    }

    // Method to get all the users the channel follows
    async getChannelFollowers() {
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

    // Method to get the channel VIP's
    async getChannelVips() {
        try {
            const data = await this.apiClient.channels.getVipsPaginated(this.userId).getAll();
            const vips = data.map((vip) => ({
                id: vip.id,
                display_name: vip.displayName,
            }));
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
            return mods;
        }
        catch (error) {
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
            return user;
        }
        catch (error) {
            writeToLogFile('error', `Error getting user data: ${error}`);
        }
    }

    // Method to return the api client
    getApiClient() {
        return this.apiClient;
    }
}
