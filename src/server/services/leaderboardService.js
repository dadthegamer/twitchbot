import logger from "../utilities/logger.js";
import { twitchApi, currencyDB, usersDB } from '../config/initializers.js';


class LeaderboardDB {

    // Method to increase bits for a user
    async increaseBitsForUser(userId, bits) {
        try {
            usersDB.increaseUserValue(userId, 'bits', bits);
        }
        catch (err) {
            logger.error(`Error in increaseBitsForUser in LeaderboardDB: ${err}`);
        }
    }

    // Method to increase subs for a user
    async increaseSubsForUser(userId, subs) {
        try {
            usersDB.increaseUserValue(userId, 'subs', subs);
        }
        catch (err) {
            logger.error(`Error in increaseSubsForUser in LeaderboardDB: ${err}`);
        }
    }

    // Method to increase dontations for a user
    async increaseDonationsForUser(userId, donations) {
        try {
            usersDB.increaseUserValue(userId, 'donations', donations);
        }
        catch (err) {
            logger.error(`Error in increaseDonationsForUser in LeaderboardDB: ${err}`);
        }
    }

    // Method to increase view time for a user
    async increaseViewTimeForUser(userId, viewTime) {
        try {
            usersDB.increaseUserValue(userId, 'viewTime', viewTime);
        }
        catch (err) {
            logger.error(`Error in increaseViewTimeForUser in LeaderboardDB: ${err}`);
        }
    }

    // Method to increase chat messages for a user
    async increaseChatMessagesForUser(userId) {
        try {
            usersDB.increaseUserValue(userId, 'chatMessages', 1);
        }
        catch (err) {
            logger.error(`Error in increaseChatMessagesForUser in LeaderboardDB: ${err}`);
        }
    }

    // method to increase emotes used for a user
    async increaseEmotesUsedForUser(userId, emotesUsed) {
        try {
            usersDB.increaseUserValue(userId, 'emotesUsed', emotesUsed);
        }
        catch (err) {
            logger.error(`Error in increaseEmotesUsedForUser in LeaderboardDB: ${err}`);
        }
    }

    // Method to increase commands used for a user
    async increaseCommandsUsedForUser(userId, commandsUsed) {
        try {
            usersDB.increaseUserValue(userId, 'commandsUsed', commandsUsed);
        }
        catch (err) {
            logger.error(`Error in increaseCommandsUsedForUser in LeaderboardDB: ${err}`);
        }
    }

    // Method to get the leaderboards for view time
    async getViewTimeLeaderboard() {
        try {
            return usersDB.getLeaderboardByProperty('viewTime');
        }
        catch (err) {
            logger.error(`Error in getViewTimeLeaderboard in LeaderboardDB: ${err}`);
        }
    }

    // Method to get the leaderboards for bits
    async getBitsLeaderboard() {
        try {
            return usersDB.getLeaderboardByProperty('bits');
        }
        catch (err) {
            logger.error(`Error in getBitsLeaderboard in LeaderboardDB: ${err}`);
        }
    }

    // Method to get the leaderboards for subs
    async getSubsLeaderboard() {
        try {
            return usersDB.getLeaderboardByProperty('subs');
        }
        catch (err) {
            logger.error(`Error in getSubsLeaderboard in LeaderboardDB: ${err}`);
        }
    }

    // Method to get the leaderboards for donations
    async getDonationsLeaderboard() {
        try {
            return usersDB.getLeaderboardByProperty('donations');
        }
        catch (err) {
            logger.error(`Error in getDonationsLeaderboard in LeaderboardDB: ${err}`);
        }
    }

    // Method to get the leaderboards for chat messages
    async getChatMessagesLeaderboard() {
        try {
            return usersDB.getLeaderboardByProperty('chatMessages');
        }
        catch (err) {
            logger.error(`Error in getChatMessagesLeaderboard in LeaderboardDB: ${err}`);
        }
    }

    // Method to get the leaderboards for emotes used
    async getEmotesUsedLeaderboard() {
        try {
            return usersDB.getLeaderboardByProperty('emotesUsed');
        }
        catch (err) {
            logger.error(`Error in getEmotesUsedLeaderboard in LeaderboardDB: ${err}`);
        }
    }

    // Method to get the leaderboards for commands used
    async getCommandsUsedLeaderboard() {
        try {
            return usersDB.getLeaderboardByProperty('commandsUsed');
        }
        catch (err) {
            logger.error(`Error in getCommandsUsedLeaderboard in LeaderboardDB: ${err}`);
        }
    }
}

export default LeaderboardDB;