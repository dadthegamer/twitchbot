import Axios from "axios";
import { usersDB } from "../config/initializers.js";
import logger from "../utilities/logger.js";

const url = process.env.FIREBOT_URL;
const leaderBoardKey = '4254bd80-11c6-11ed-8d35-7964b0db002f'

// Function to set the leaderboard points for a user in the database
async function setLeaderboardPoints(userId, points) {
    if (typeof userId !== 'string') {
        userId = userId.toString();
    }
    const db = await connectToMongoDB();
    try {
        const collection = db.collection("userData");
        const query = { id: userId };
        const update = {
            $set: {
                leaderboard_points: points,
            }
        };
        const options = { upsert: true };
        await collection.findOneAndUpdate(query, update, options);
    } catch (error) {
        logger.error(`Error setting leaderboard points: ${error}`);
    }
}

// Function to increase a user value in the database
async function updateFirebotUserData(firebotData) {
    try {
        console.log(`Updating user data for ${firebotData.username} (${firebotData.minutesInChannel})`);
        usersDB.setUserValue(firebotData._id, 'view_time', firebotData.minutesInChannel);
    } catch (error) {
        logger.error(`Error updating user data: ${error}`);
    }
}

// Function to retrieve all user data from firebot
async function getFirebotUserData() {
    try {
        const response = await Axios.get(`${url}/api/v1/viewers/`);
        console.log(`Retrieved ${response} users from Firebot`);
        const users = response.data;
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userData = await Axios.get(`${url}/api/v1/viewers/${user.id}`);
            const firebotData = userData.data;
            await updateFirebotUserData(firebotData);
        }
        return response.data;
    } catch (error) {
        logger.error(`Error retrieving Firebot user data: ${error}`);
    }
}

// Function to retrieve all quotes from firebot
async function getFirebotQuotes() {
    try {
        const response = await Axios.get(`${url}/api/v1/quotes/`);
        const quotes = response.data;
        for (let i = 0; i < quotes.length; i++) {
            const quote = quotes[i];
            await storeFirebotQuote(quote);
        }
        return response.data;
    } catch (error) {
        logger.error(`Error retrieving Firebot quotes: ${error}`);
    }
}

// Function to get currency data from firebot
async function getFirebotCurrency() {
    try {
        const response = await Axios.get(`${url}/api/v1/currency/`);
        return currency;
    } catch (error) {
        logger.error(`Error retrieving Firebot currency: ${error}`);
    }
}

// Function to store store a quote in the database
async function storeFirebotQuote(quote) {

    try {
        const db = await connectToMongoDB();
        const collection = db.collection("quotes");
        const existing = await collection.findOne({ id: quote.id });
        if (!existing) {
            await collection.insertOne(quote);
        }
    } catch (error) {
        logger.error(`Error storing Firebot quote: ${error}`);
    }
}

export async function initializeFirebot() {
    try {
        await getFirebotUserData();
        // await getFirebotQuotes();
        console.log('Firebot initialized');
    }
    catch (error) {
        logger.error(`Error initializing Firebot: ${error}`);
    }
}

export { getFirebotUserData, getFirebotQuotes, getFirebotCurrency }