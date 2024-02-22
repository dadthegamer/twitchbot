import logger from "../utilities/logger.js";

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
    async storeTwitchUserAuthToken(userId, token, refreshToken, expiresIn) {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const filter = { userId: userId };
            const update = {
                $set: {
                    userId,
                    token,
                    refreshToken,
                    expiresIn,
                    obtainmentTimestamp: 0,
                    type: 'twitch'
                },
            };
            const options = { upsert: true };
            await collection.updateOne(filter, update, options);
            logger.info(`User auth token stored for ${userId}.`);
        } catch (error) {
            logger.error(`Error storing user auth token: ${error}`);
        }
    }

    // Method to store spotify user auth token in the database
    async storeSpotifyUserAuthToken(token, refreshToken, expiresIn) {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const filter = { type: 'spotify' };
            const update = {
                $set: {
                    token,
                    refreshToken,
                    expiresIn,
                    obtainmentTimestamp: new Date().getTime(),
                    type: 'spotify'
                },
            };
            const options = { upsert: true };
            await collection.updateOne(filter, update, options);
        } catch (error) {
            console.error(`Error storing user auth token: ${error}`);
            logger.error(`Error storing user auth token: ${error}`);
        }
    }

    // Method to update the spotify user auth token
    async updateSpotifyUserAuthToken(token, expiresIn) {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const filter = { type: 'spotify' };
            const update = {
                $set: {
                    token,
                    expiresIn,
                    obtainmentTimestamp: new Date().getTime()
                },
            };
            const options = { upsert: true };
            await collection.updateOne(filter, update, options);
            logger.info(`User auth token updated for ${userId}.`);
        } catch (error) {
            logger.error(`Error updating user auth token: ${error}`);
        }
    }

    // Method to update a users auth token
    async updateTwitchUserAuthToken(userId, token, refreshToken, expiresIn, obtainmentTimestamp) {
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

    // Method to get all tokens with a type of 'twitch'
    async getTwitchTokens() {
        try {
            const collection = await this.dbConnection.collection(this.collectionName);
            const result = await collection.find({ type: 'twitch' }).toArray();
            return result;
        } catch (error) {
            logger.error(`Error getting twitch tokens: ${error}`);
        }
    }

    // Method to get all tokens with a type of 'spotify'
    async getSpotifyToken() {
        try {
            const collection = await this.dbConnection.collection(this.collectionName);
            const result = await collection.find({ type: 'spotify' }).toArray();;
            return result;
        } catch (error) {
            logger.error(`Error getting spotify tokens: ${error}`);
        }
    }
}

export default TokenDB;
