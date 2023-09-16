import logger from "../utilities/logger.js";
import { webSocket } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';

// Subathon Class
export class StreamathonService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'streamSettings';
        this.createInitialStreamathonSettings();
        this.getStreamathonSettings();
    }

    // Method to create the initial streamathon settings in the database and cache if they dont exist
    async createInitialStreamathonSettings() {
        try {
            const initialstreamathonSettings = {
                name: 'StreamathonSettings',
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
            // check if the name exists in the database. If not, create the initial streamathon settings and cache it
            const streamathonSettings = await this.dbConnection.collection(this.collectionName).findOne({ name: initialstreamathonSettings.name });
            if (!streamathonSettings) {
                await this.dbConnection.collection(this.collectionName).insertOne(initialstreamathonSettings);
                await this.cache.set('streamathonSettings', initialstreamathonSettings);
            } else {
                await this.cache.set('streamathonSettings', streamathonSettings);
            }
        }
        catch (error) {
            logger.error(`Error creating initial streamathon settings: ${error}`);
        }
    }

    // Method to get the streamathon settings from the cache. If it doesnt exist, get it from the database and cache it
    async getStreamathonSettings() {
        try {
            let streamathonSettings = await this.cache.get('streamathonSettings');
            if (!streamathonSettings) {
                streamathonSettings = await this.dbConnection.collection(this.collectionName).findOne({ name: 'StreamathonSettings' });
                await this.cache.set('streamathonSettings', streamathonSettings);
            }
            return streamathonSettings;
        }
        catch (error) {
            logger.error(`Error getting streamathon settings: ${error}`);
        }
    }


    // Method to update the streamathon settings in the database and cache
    async updateStreamathonSettings(streamathonSettings) {
        try {
            await this.cache.set('streamathonSettings', streamathonSettings);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { name: 'StreamathonSettings' }, 
                { $set: streamathonSettings }
            );
            return streamathonSettings;
        }
        catch (error) {
            logger.error(`Error updating streamathon settings: ${error}`);
        }
    }
}
