import logger from "../utilities/logger.js";
import { environment } from "../config/environmentVars.js";
import { usersDB, cache } from "../config/initializers.js";
import fs from 'fs';
import { getChattersWithoutBots } from '../handlers/twitch/viewTimeHandler.js';

class TaskCoordinator {
    constructor(twitchAPI, usersDB) {
        this.twitchAPI = twitchAPI;
        this.usersDB = usersDB;
        this.initialize();
    }

    async initialize() {
        try {
            if (environment === 'development') {
                logger.info('Initializing TaskCoordinator');
            } else {
                await this.getAllFollowers();
                await this.getAllSubscribers();
                await this.getAllVips();
                await this.getAllModerators();
                await this.getBitsLeaderboard();
                await getChattersWithoutBots();
                await this.getViewers();
            }
        }
        catch (error) {
            logger.error(`Error initializing TaskCoordinator: ${error}`);
        }
    }

    // Method to get the bits leaderboard
    async getBitsLeaderboard() {
        try {
            const leaderboard = await this.twitchAPI.getBitsLeaderboard();
            for (const user of leaderboard) {
                await this.usersDB.setBitsManually(user.userId, user.amount);
            }
            return leaderboard;
        }
        catch (error) {
            logger.error(`Error getting bits leaderboard: ${error}`);
        }
    }

    // Method to get all the followers for a channel and udpate the database
    async getAllFollowers() {
        try {
            const followers = await this.twitchAPI.getFollowers();
            for (const follower of followers) {
                await this.usersDB.addUserManually(follower.userId, follower.followDate);
            }
        }
        catch (error) {
            logger.error(`Error getting followers: ${error}`);
        }
    }

    // Method to get all the subscribers for a channel and update the database
    async getAllSubscribers() {
        try {
            const subscribers = await this.twitchAPI.getChannelSubscribers();
            for (const subscriber of subscribers) {
                await this.usersDB.addSubscriber(subscriber.userId);
            }
        }
        catch (error) {
            logger.error(`Error getting subscribers: ${error}`);
        }
    }

    // method to get all the VIP's for a channel and update the database
    async getAllVips() {
        try {
            const vips = await this.twitchAPI.getChannelVips();
            for (const vip of vips) {
                await this.usersDB.addVip(vip.id);
            }
        }
        catch (error) {
            logger.error(`Error getting VIP's: ${error}`);
        }
    }

    // Method to get all the moderators for a channel and update the database
    async getAllModerators() {
        try {
            const moderators = await this.twitchAPI.getChannelModerators();
            for (const moderator of moderators) {
                await this.usersDB.addModerator(moderator.userId);
            }
        }
        catch (error) {
            logger.error(`Error getting moderators: ${error}`);
        }
    }

    // Method to get the data array located in the userData.json file in the data folder
    async processUsers() {
        try {
            const users = JSON.parse(fs.readFileSync('./data/userData.json', 'utf8'));
            for (const user of users) {
                await this.usersDB.setViewTime(user.id, 'allTime', user.view_time);
            }
        }
        catch (error) {
            console.log(error);
            logger.error(`Error getting user data: ${error}`);
        }
    }

    // Method to get all viewers in chat every 2 minutes
    async getViewers() {
        try {
            setInterval(async () => {
                const viewers = await getChattersWithoutBots();
                cache.set('currentViewers', viewers);
            }, 60000);
        } catch (error) {
            logger.error(`Error in getViewers: ${error}`);
        }
    }

    // Method to get all the channel points rewards
}


export default TaskCoordinator;