import { ApiClient } from '@twurple/api';
import { RefreshingAuthProvider } from '@twurple/auth';
import { writeToLogFile } from '../utilities/logging.js';


// Class for the Twitch API client
export class AuthProviderManager  {
    constructor(tokenDBInstance, clientId, clientSecret, userId, botUserId) {
        this.userId = userId;
        this.botUserId = botUserId;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenDB = tokenDBInstance;
        this.authProvider = null;
    }

    // Method to initialize the auth provider
    async initializeAuthProvider() {
        try {
            if (!this.clientId || !this.clientSecret) {
                throw new Error("Client ID or Client Secret is missing.");
            }
            this.authProvider = new RefreshingAuthProvider({
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                onRefresh: async (userId, newTokenData) =>
                    await this.tokenDB.storeUserAuthToken(userId, newTokenData.accessToken, newTokenData.refreshToken, newTokenData.expiresIn),
            }); 
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error initializing auth provider: ${error}`);
        }
    }

    // Method to add a user to the auth provider
    async addUserToAuthProvider(userId) {
        try {
            const tokenData = await this.tokenDB.getUserAuthToken(userId);
            if (tokenData === null) {
                writeToLogFile('error', `No token data found for user ${userId}.`);
                console.log('No token data found.');
                return;
            }
            try {
                await this.authProvider.addUser(userId, tokenData, ['chat']);
            } catch (error) {
                console.log(`Error adding user for token: ${error}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // Method to get the auth provider
    getAuthProvider() {
        if (!this.authProvider === null) {
            throw new Error("Auth Provider has not been initialized. Call `initializeAuthProvider` first.");
        }
        return this.authProvider;
    }
}