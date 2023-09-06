import { RefreshingAuthProvider } from '@twurple/auth';
import { writeToLogFile } from '../utilities/logging.js';

// Class for the Twitch API client
export class AuthProviderManager {
    constructor(tokenDBInstance) {
        this.userId = '64431397';
        this.clientId = process.env.TWITCH_CLIENT_ID;
        this.clientSecret = process.env.TWITCH_CLIENT_SECRET;
        this.tokenDB = tokenDBInstance;
        this.authProvider = null;
        this.initializeAuthProvider();
        this.addAllUsersToAuthProvider();
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
                    onRefresh: async (userId, newTokenData) =>
                        await this.tokenDB.storeUserAuthToken(userId, newTokenData.accessToken, newTokenData.refreshToken, newTokenData.expiresIn),
                }
            );
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
                console.log('No token data found.');
                return;
            }
            try {
                for (const token of tokenData) {
                    await this.authProvider.addUser(token.userId, token, ['chat']);
                    console.log(`Added user ${token.userId} to auth provider.`)
                }
            } catch (error) {
                console.log(`Error adding user for token: ${error}`);
            }
        }
        catch (error) {
            console.log(error);
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