import logger from "../utilities/logger.js";
import Axios from 'axios';
import { usersDB } from "../config/initializers.js";

// Command Class
class FirebotService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.firebotURL = 'http://192.168.1.37:7472';
    }

    // Method to get all the viewers from firebot
    async getFirebotViewers() {
        try {
            const response = await Axios.get(`${this.firebotURL}/api/v1/viewers`);
            return response.data;
        } catch (error) {
            logger.error(`Error getting firebot viewers: ${error}`);
        }
    }

    // Method to get all the quotes from firebot
    async getFirebotQuotes() {
        try {
            const response = await Axios.get(`${this.firebotURL}/api/v1/quotes`);
            return response.data;
        } catch (error) {
            console.log(error);
            logger.error(error);
        }
    }

    // Method to store the firebot quotes in the database if they don't exist
    async storeFirebotQuotes() {
        try {
            const quotes = await this.getFirebotQuotes();
            // Loop through the quotes and store them in the database if the quote id doesn't exist
            for (const quote of quotes) {
                const exists = await this.dbConnection.collection('quotes').findOne({ id: quote.id });
                if (!exists) {
                    // Convert the createdAt date to a date object
                    quote.createdAt = new Date(quote.createdAt);
                    await this.dbConnection.collection('quotes').insertOne(quote);
                }
            }
        } catch (error) {
            logger.error(`Error storing firebot quotes: ${error}`);
        }
    }

    // Method to get the viewer data from firebot
    async getFirebotViewerData(userId) {
        try {
            const userData = await Axios.get(`${this.firebotURL}/api/v1/viewers/${userId}`);
            return userData.data;
        } catch (error) {
            console.log(error);
            logger.error(`Error getting firebot viewer data: ${error}`);
        }
    }

    // Method to get the viewtime for each viewer from firebot and update the database viewtime for each viewer
    async updateFirebotViewtime() {
        try {
            const viewers = await this.getFirebotViewers();
            // Loop through the viewers and update the database viewtime for each viewer
            for (const viewer of viewers) {
                const viewerData = await this.getFirebotViewerData(viewer.id);
                const follower = await usersDB.isFollower(viewer.id);
                // If the viewer is a follower, update the viewtime
                if (follower) {
                    if (viewerData.minutesInChannel > 0) {
                        console.log(`Updating viewtime for ${viewer.displayName}`);
                        await usersDB.setViewTime(viewer.id, 'allTime', viewerData.minutesInChannel);
                    }
                }
            }
        } catch (error) {
            console.log(error);
            logger.error(`Error updating firebot viewtime: ${error}`);
        }
    }
}

export default FirebotService;