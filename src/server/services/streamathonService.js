import logger from "../utilities/logger.js";
import { webSocket } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';


// Subathon Class
export class StreamathonService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'streamSettings';
        this.timer = null;
        this.timerInterval = null;
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
                streamathonCurrentTimer: 0,
                streamathonTotalTimer: 0,
                streamathonCap: 0,
                description: null,
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
                    tikTok: {
                        followers: {
                            time: 0,
                            minimum: 0,
                        },
                        likes: {
                            time: 0,
                            minimum: 0,
                        },
                        gifts: {
                            time: 0,
                            minimum: 0,
                        },
                    }
                },
            }
            // check if the name exists in the database. If not, create the initial streamathon settings and cache it
            const streamathonSettings = await this.dbConnection.collection(this.collectionName).findOne({ name: initialstreamathonSettings.name });
            if (!streamathonSettings) {
                await this.dbConnection.collection(this.collectionName).insertOne(initialstreamathonSettings);
                await this.cache.set('streamathonSettings', initialstreamathonSettings);
                if (streamathonSettings.streamathonCurrentTimer > 0) {
                    this.startStreamathonTimer();
                }
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
            // Remove the _id from the streamathon settings object
            delete streamathonSettings._id;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { name: 'StreamathonSettings' },
                { $set: streamathonSettings }
            );
            return streamathonSettings;
        }
        catch (error) {
            console.log(error);
            logger.error(`Error updating streamathon settings: ${error}`);
        }
    }

    // Method to update the streamathon current timer in the database and the cache.
    async updateStreamathonCurrentTimer(streamathonCurrentTimer) {
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            streamathonSettings.streamathonCurrentTimer = streamathonCurrentTimer;
            await this.updateStreamathonSettings(streamathonSettings);
            return streamathonSettings;
        }
        catch (error) {
            logger.error(`Error updating streamathon current timer: ${error}`);
        }
    }

    // Method to add to the total streamathon timer in the database and the cache. if the total time is greater than the cap, set the timer to the cap
    async addToStreamathonTotalTimer(timer) {
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            streamathonSettings.streamathonTotalTimer = streamathonSettings.streamathonTotalTimer + timer;
            if (streamathonSettings.streamathonTotalTimer > streamathonSettings.streamathonCap) {
                streamathonSettings.streamathonTotalTimer = streamathonSettings.streamathonCap;
            } else {
                webSocket.streamathonUpdate({
                    timeToAdd: timer,
                    currentTimer: streamathonSettings.streamathonCurrentTimer,
                })
            };
            this.timer = this.timer + timer;
            await this.updateStreamathonSettings(streamathonSettings);
            return streamathonSettings;
        }
        catch (error) {
            logger.error(`Error adding to streamathon total timer: ${error}`);
        }
    }

    // Method to start the streamathon timer. Get the streamathon settings from the cache and start the timer
    async startStreamathonTimer() {
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            let streamStartTime = streamathonSettings.streamathonStartTime;
            if (streamStartTime === null) {
                logger.error('Streamathon start time is null');
                return;
            } else {
                // Start a timer for every second to update the streamathon timer. If the timer is 0, stop the timer.
                this.timer = streamStartTime;
                this.timerInterval = setInterval(async () => {
                    this.timer = this.timer - 1;
                    await this.updateStreamathonCurrentTimer(this.timer);
                    if (this.timer === 0) {
                        await this.stopStreamathonTimer();
                    };
                }, 1000 * 60);
            }
        }
        catch (error) {
            logger.error(`Error starting streamathon timer: ${error}`);
        }
    }

    // Method to start the streamathone timer if streamathonActive is true
    async startStreamathon() {
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonActive = streamathonSettings.streamathonActive;
            if (streamathonActive) {
                await this.startStreamathonTimer();
            }
        }
        catch (error) {
            logger.error(`Error starting streamathon: ${error}`);
        }
    }

    // Method to stop the streamathon timer. Get the streamathon settings from the cache and stop the timer
    async stopStreamathonTimer() {
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonActive = streamathonSettings.streamathonActive;
            if (streamathonActive) {
                streamathonSettings.streamathonCurrentTimer = 0;
                await this.updateStreamathonSettings(streamathonSettings);
                clearInterval(this.timerInterval);
                webSocket.streamathonUpdate({
                    timeToAdd: 0,
                    currentTimer: 0,
                })
                return streamathonSettings;
            }
        }
        catch (error) {
            logger.error(`Error stopping streamathon timer: ${error}`);
        }
    }

    // Method to add to the timer for subs. If it is greater than the minimum, add to the streamathon total timer
    async addToSubTimer(subs) {
        // Check if subs is a number. If it is not convert it. If it is not a number, return
        if (typeof subs !== 'number') {
            subs = parseInt(subs);
            if (isNaN(subs)) {
                logger.error('Subs is not a number');
                return;
            }
        };
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonActive = streamathonSettings.streamathonActive;
            if (!streamathonActive) {
                return;
            }
            const timeToAdd = streamathonSettings.parameters.subs.time;
            const subMinimum = streamathonSettings.parameters.subs.minimum;
            if (subs >= subMinimum) {
                let totalTimeToAdd = 0;
                while (subs >= subMinimum) {
                    totalTimeToAdd = totalTimeToAdd + timeToAdd;
                    subs = subs - subMinimum;
                    if (subs < subMinimum) {
                        break;
                    };
                };
                await this.addToStreamathonTotalTimer(totalTimeToAdd);
            }
        }
        catch (error) {
            logger.error(`Error adding to sub timer: ${error}`);
        }
    }

    // Method to add to the timer for bits. If it is greater than the minimum, add to the streamathon total timer
    async addToBitsTimer(bits) {
        // Check if bits is a number. If it is not convert it. If it is not a number, return
        if (typeof bits !== 'number') {
            bits = parseInt(bits);
            if (isNaN(bits)) {
                logger.error('Bits is not a number');
                return;
            }
        };
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonActive = streamathonSettings.streamathonActive;
            if (!streamathonActive) {
                return;
            }
            const timeToAdd = streamathonSettings.parameters.bits.time;
            const bitsMinimum = streamathonSettings.parameters.bits.minimum;
            if (bits >= bitsMinimum) {
                let totalTimeToAdd = 0;
                while (bits >= bitsMinimum) {
                    totalTimeToAdd = totalTimeToAdd + timeToAdd;
                    bits = bits - bitsMinimum;
                    if (bits < bitsMinimum) {
                        break;
                    };
                };
                await this.addToStreamathonTotalTimer(totalTimeToAdd);
            }
        }
        catch (error) {
            logger.error(`Error adding to bit timer: ${error}`);
        }
    }

    // Method to add to the timer for followers. If it is greater than the minimum, add to the streamathon total timer
    async addToFollowerTimer() {
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonActive = streamathonSettings.streamathonActive;
            if (!streamathonActive) {
                return;
            }
            const timeToAdd = streamathonSettings.parameters.followers;
            await this.addToStreamathonTotalTimer(timeToAdd);
        }
        catch (error) {
            logger.error(`Error adding to follower timer: ${error}`);
        }
    }

    // Method to add to the timer for donations. If it is greater than the minimum, add to the streamathon total timer
    async addToDonationTimer(donation) {
        // Check if donation is a number. If it is not convert it. If it is not a number, return
        if (typeof donation !== 'number') {
            donation = parseInt(donation);
            if (isNaN(donation)) {
                logger.error('Donation is not a number');
                return;
            }
        };
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonActive = streamathonSettings.streamathonActive;
            if (!streamathonActive) {
                return;
            }
            const timeToAdd = streamathonSettings.parameters.donations.time;
            const donationMinimum = streamathonSettings.parameters.donations.minimum;
            if (donation >= donationMinimum) {
                let totalTimeToAdd = 0;
                while (donation >= donationMinimum) {
                    totalTimeToAdd = totalTimeToAdd + timeToAdd;
                    donation = donation - donationMinimum;
                    if (donation < donationMinimum) {
                        break;
                    };
                };
                await this.addToStreamathonTotalTimer(totalTimeToAdd);
            }
        }
        catch (error) {
            logger.error(`Error adding to donation timer: ${error}`);
        }
    }

    // Method to add to the timer for hype train if it is enabled.
    async addHypeTrainTimer() {
        try {
            const streamathonSettings = await this.getStreamathonSettings();
            const streamathonActive = streamathonSettings.streamathonActive;
            if (!streamathonActive) {
                return;
            }
            const hypeTrainEnabled = streamathonSettings.parameters.hypeTrain.enabled;
            if (hypeTrainEnabled) {
                const hypeTrainPerLevel = streamathonSettings.parameters.hypeTrain.perLevel;
                await this.addToStreamathonTotalTimer(hypeTrainPerLevel);
            }
        }
        catch (error) {
            logger.error(`Error adding to hype train timer: ${error}`);
        }
    }
}

export default StreamathonService;
