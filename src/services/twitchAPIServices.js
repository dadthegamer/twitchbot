import { ApiClient } from '@twurple/api';
import { writeToLogFile } from '../utils/logging.js';

// Class for the Twitch API client
export class TwitchApiClient {
    constructor(authProvider, userId) {
        this.apiClient = new ApiClient({ authProvider: authProvider });
        this.userId = userId;
    }

    async getChannelModerators() {
        try {
            const data = await this.apiClient.moderation.getModerators(this.userId, 100);
            const mods = data.data.map((mod) => ({
                userId: mod.userId,
                username: mod.userName,
                userDisplayName: mod.userDisplayName,
            }));
            return mods;
        }
        catch (error) {
            writeToLogFile('error', `Error getting channel moderators: ${error}`);
        }
    }

    // Method to return the api client
    getApiClient() {
        return this.apiClient;
    }
}
