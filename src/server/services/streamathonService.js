import logger from "../utilities/logger.js";
import { webSocket } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';

// Subathon Class
export class StreamathonService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'streamathon';
        this.createInitialStreamathonSettings();
        this.getStreamathonSettings();
    }

    // Method to create the initial subathon settings in the database and cache if they dont exist
    async createInitialStreamathonSettings() {
        try {
            const initialstreamathonSettings = {
                streamathonActive: false,
                streamathonStartTime: null,
                description: null,
                streamathonCap: 0,
                streamathonCurrent: 0,
                streamathonGoals: {
                    subGoal: 0,
                    donationGoal: 0,
                    cheerGoal: 0,
                    followerGoal: 0,
                    tikTokFollowersGoal: 0,
                    tikTokLikesGoal: 0,
                    tikTokGiftsGoal: 0,
                },
                streamathonAlertTime: 3000,
                streamathonHandlers: [],
                parameters: {
                    subs: {
                        time: 0,
                        minimum: 0,
                    },
                    bits: {
                        time: 0,
                        minimum: 0,
                    },
                    followers: 0,
                    donations: {
                        time: 0,
                        minimum: 0,
                    },
                    hypeTrain: {
                        enabled: false,
                        perLevel: 0,
                    },
                    tikTokFollowers: 0,
                    tikTokLikes: 0,
                    tikTokGifts: 0,
                },
            }
            const subathonSettings = await this.dbConnection.collection(this.collectionName).findOne();
            if (!subathonSettings) {
                await this.dbConnection.collection(this.collectionName).insertOne(initialstreamathonSettings);
                await this.cache.set('streamathonSettings', initialstreamathonSettings);
                logger.info('Initial streamathon settings created');
            }
        }
        catch (error) {
            logger.error(`Error creating initial streamathon settings: ${error}`);
        }
    }

    // Method to get the streamathon settings from the database and cache
    async getStreamathonSettings() {
        try {
            const streamathonSettings = await this.cache.get('streamathonSettings');
            if (streamathonSettings) {
                return streamathonSettings;
            }
            else {
                const streamathonSettings = await this.dbConnection.collection(this.collectionName).findOne();
                await this.cache.set('streamathonSettings', streamathonSettings);
                return streamathonSettings;
            }
        }
        catch (error) {
            logger.error(`Error getting streamathon settings: ${error}`);
        }
    }

    // Method to update the streamathon settings in the database and cache
    async updateStreamathonSettings(streamathonSettings) {
        try {
            await this.dbConnection.collection(this.collectionName).updateOne({}, { $set: streamathonSettings });
            await this.cache.set('streamathonSettings', streamathonSettings);
            return streamathonSettings;
        }
        catch (error) {
            logger.error(`Error updating streamathon settings: ${error}`);
        }
    }

    // Method to increase the streamathon current by the amount in the parameters based on what is passed in. If the streamathon current is greater than or equal to the streamathon cap, then set the streamathon current to the streamathon cap
    async increaseStreamathonCurrent(parameter) {
        // Check if a streamathon is active
        const streamathonSettings = await this.getStreamathonSettings();
        if (!streamathonSettings.streamathonActive) {
            return;
        }
        // Check if the parameter is valid
        const validParameters = ['subs', 'bits', 'followers', 'donations', 'tikTokFollowers', 'tikTokLikes', 'tikTokGifts'];
        if (!validParameters.includes(parameter)) {
            logger.error(`Invalid parameter: ${parameter}`);
            return new Error(`Invalid parameter: ${parameter}`);
        }
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonCurrent = streamathonSettings.streamathonCurrent;
            const streamathonCap = streamathonSettings.streamathonCap;
            const newStreamathonCurrent = streamathonCurrent + streamathonSettings.parameters[parameter];
            if (newStreamathonCurrent >= streamathonCap) {
                streamathonSettings.streamathonCurrent = streamathonCap;
            }
            else {
                streamathonSettings.streamathonCurrent = newStreamathonCurrent;
            }
            await this.updateStreamathonSettings(streamathonSettings);
            return streamathonSettings;
        }
        catch (error) {
            logger.error(`Error increasing streamathon current: ${error}`);
        }
    }
}
