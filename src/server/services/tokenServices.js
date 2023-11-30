import logger from "../utilities/logger.js";
import bcrypt  from "bcrypt";

// Class for token data
class TokenDB {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.collectionName = 'tokens';
    }

    // Method to get the current token
    async getToken() {
        try {
            const collection = await this.dbConnection.collection('tokens');
            const result = await collection.findOne({});
            return result;
        }
        catch (error) {
            logger.error(`Error in getToken: ${error}`);
        }
    }

    // Method to store user auth token in the database
    async storeUserAuthToken(userId, token, refreshToken, expiresIn) {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const filter = { userId: userId };
            const update = {
                $set: {
                    userId,
                    token,
                    refreshToken,
                    expiresIn,
                    obtainmentTimestamp: 0
                },
            };
            const options = { upsert: true };
            await collection.updateOne(filter, update, options);
            logger.info(`User auth token stored for ${userId}.`);
        } catch (error) {
            logger.error(`Error storing user auth token: ${error}`);
        }
    }

    // Method to update a users auth token
    async updateUserAuthToken(userId, token, refreshToken, expiresIn, obtainmentTimestamp) {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const filter = { userId: userId };
            const update = {
                $set: {
                    userId,
                    token,
                    refreshToken,
                    expiresIn,
                    obtainmentTimestamp
                },
            };
            const options = { upsert: true };
            await collection.updateOne(filter, update, options);
            logger.info(`User auth token updated for ${userId}.`);
        } catch (error) {
            logger.error(`Error updating user auth token: ${error}`);
        }
    }

    // Method to get a users auth token
    async getUserAuthToken(userId) {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const result = await collection.findOne({ userId: userId });
            return result;
        } catch (error) {
            logger.error(`Error getting user auth token: ${error}`);
        }
    }

    //Method to get all the tokens in the database
    async getAllTokens() {
        try {
            const collection = await this.dbConnection.collection(this.collectionName);
            const result = await collection.find({}).toArray();
            return result;
        } catch (error) {
            logger.error(`Error getting all tokens: ${error}`);
        }
    }
}

export default TokenDB;
