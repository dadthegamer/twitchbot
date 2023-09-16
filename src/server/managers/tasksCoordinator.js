import logger from "../utilities/logger.js";
import { environment } from "../config/environmentVars.js";

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
                console.log('Initializing TaskCoordinator');
                await this.getAllFollowers();
                await this.getAllSubscribers();
                await this.getAllVips();
                await this.getAllModerators();
                console.log('Task coordinator initialized');
            }
        }
        catch (error) {
            logger.error(`Error initializing TaskCoordinator: ${error}`);
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
                await this.usersDB.addVip(vip.userId);
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
}


export default TaskCoordinator;