import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { writeToLogFile } from '../utilities/logging.js';
import { startEventListener } from './twitchEventListenerServices.js';
import { TwitchBotClient } from './twitchBotServices.js';

// Class for the Twitch API client
export class AuthProviderManager {
    constructor(tokenDBInstance) {
        this.userId = '64431397';
        this.clientId = process.env.TWITCH_CLIENT_ID;
        this.clientSecret = process.env.TWITCH_CLIENT_SECRET;
        this.tokenDB = tokenDBInstance;
        this.authProvider = null;
        this.ApiClient = null;
        this.initializeAuthProvider();
    }

    // Method to initialize the auth provider
    async initializeAuthProvider() {
        try {
            if (!this.clientId || !this.clientSecret) {
                throw new Error("Client ID or Client Secret is missing.");
            }
            this.authProvider = new RefreshingAuthProvider(
                {
                    clientId: this.clientId,
                    clientSecret: this.clientSecret,
                }
            );
            this.authProvider.onRefresh(async (userId, tokenData) => {
                await this.tokenDB.updateUserAuthToken(userId, tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn, tokenData.obtainmentTimestamp);
            });
            this.authProvider.onRefreshFailure(async (userId, error) => {
                writeToLogFile('error', `Error refreshing token for user ${userId}: ${error}`);
                console.log(`Error refreshing token for user ${userId}: ${error}`);
            });
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error initializing auth provider: ${error}`);
        }
    }

    // Method to get all the tokens from the database and add them to the auth provider
    async addAllUsersToAuthProvider() {
        if (this.authProvider === null) {
            throw new Error("Auth Provider has not been initialized. Call `initializeAuthProvider` first.");
        }
        try {
            const tokenData = await this.tokenDB.getAllTokens();
            if (tokenData === null) {
                writeToLogFile('error', `No token data found.`);
                return;
            }
            try {
                for (const token of tokenData) {
                    await this.addUserToAuthProvider(token);
                }
            } catch (error) {
                writeToLogFile('error', `Error adding user for token: ${error}`);
                console.log(`Error adding user for token: ${error}`);
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    // Method to add a user to the auth provider
    async addUserToAuthProvider(tokenData) {
        try {
            if (tokenData === null) {
                writeToLogFile('error', `No token data found for user ${tokenData.userId}.`);
                return;
            }
            if (tokenData.userId === '671284746') {
                this.authProvider.addUser(tokenData.userId, tokenData, ['chat']);
            } else {
                this.authProvider.addUser(tokenData.userId, tokenData);
                this.ApiClient = new ApiClient({ authProvider: this.authProvider });
            }
        }
        catch (error) {
            writeToLogFile('error', `Error adding user to auth provider: ${error}`);
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