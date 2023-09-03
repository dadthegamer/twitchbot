import { writeToLogFile } from '../utilities/logging.js';


// Class for token data
export class TokenDB {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
    }

    // Method to get the current token
    async getToken() {
        try {
            const collection = await this.dbConnection.collection('tokens');
            const result = await collection.findOne({});
            return result;
        }
        catch (error) {
            writeToLogFile('error', `Error in getToken: ${error}`);
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
                },
            };
            const options = { upsert: true };
            await collection.updateOne(filter, update, options);
            writeToLogFile('info', `User auth token stored for ${userId}.`);
        } catch (error) {
            writeToLogFile('error', `Error storing user auth token: ${error}`);
            console.log(`Error storing user auth token: ${error}`);
        }
    }

    // Method to get a users auth token
    async getUserAuthToken(userId) {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const result = await collection.findOne({ userId: userId });
            return result;
        } catch (error) {
            writeToLogFile('error', `Error getting user auth token: ${error}`);
        }
    }

    //Method to get all the tokens in the database
    async getAllTokens() {
        try {
            const collection = await this.dbConnection.collection("tokens");
            const result = await collection.find({}).toArray();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error getting all tokens: ${error}`);
        }
    }
}
