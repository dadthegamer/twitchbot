import { WebcastPushConnection } from 'tiktok-live-connector';
import logger from "../utilities/logger.js";
import { webSocket, cache, usersDB } from '../config/initializers.js';


export default class TikTokService {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.connected = false;
        this.tiktokLiveConnection = null;
        this.collection = 'tiktok';
        this.tikTokLikesThreshold = 100;
        this.setIntialSettings();
    }

    // Method to set the initial database values
    async setIntialSettings() {
        try {
            const initialSettings = [
                {
                    id: 'tiktokUsername',
                    username: null,
                },
                {
                    id: 'likes',
                    likes: 0,
                    goal: 0,
                    completed: false,
                    uponCompletion: 'double',
                    handlers: [],
                },
                {
                    id: 'followers',
                    followers: 0,
                    goal: 0,
                    completed: false,
                    uponCompletion: 'double',
                    handlers: [],
                },
                {
                    id: 'shares',
                    shares: 0,
                    goal: 0,
                    completed: false,
                    uponCompletion: 'double',
                    handlers: [],
                },
                {
                    id: 'gifts',
                    gifts: 0,
                    goal: 0,
                    completed: false,
                    uponCompletion: 'double',
                    handlers: [],
                }
            ]
            // Check if there are as many settings in the database as there are in the initial settings array as well as checking to make sure each key exists under each setting
            const settings = await this.dbConnection.collection(this.collection).find().toArray();
            if (settings.length !== initialSettings.length || settings.some(setting => !initialSettings.some(initialSetting => initialSetting.name === setting.name))) {
                // If there are not as many settings in the database as there are in the initial settings array, or if there are settings in the database that do not exist in the initial settings array, then delete all settings in the database and insert the initial settings
                await this.dbConnection.collection('settings').deleteMany({});
                await this.dbConnection.collection('settings').insertMany(initialSettings);
            }

            // Cache the settings
            const cachedSettings = await this.dbConnection.collection(this.collection).find().toArray();
            cache.set('tiktokSettings', cachedSettings);
        } catch (error) {
            logger.error(`Error setting initial settings: ${error}`);
        }
    }

    // Method to get all settings from the cache if the cache exists, otherwise get all settings from the database and cache them
    async getAllSettings() {
        try {
            let settings = cache.get('tiktokSettings');
            if (!settings) {
                settings = await this.dbConnection.collection(this.collection).find().toArray();
                cache.set('tiktokSettings', settings);
            }
            return settings;
        } catch (error) {
            logger.error(`Error getting all settings: ${error}`);
        }
    }

    // Method to get the username from the cache if the cache exists, otherwise get the username from the database and cache it
    async getUsername() {
        try {
            let username = cache.get('tiktokUsername');
            if (!username) {
                username = await this.dbConnection.collection(this.collection).findOne({ id: 'tiktokUsername' });
                cache.set('tiktokUsername', username);
            }
            return username;
        } catch (error) {
            logger.error(`Error getting username: ${error}`);
        }
    }

    // Method to initialize the TikTok connection
    async initializeTikTokConnection() {
        try {
            const username = await this.getUsername();
            if (!username) {
                logger.error('No TikTok username found');
                return;
            }
            this.tiktokLiveConnection = new WebcastPushConnection(username);

            // Connect to the chat
            this.tiktokLiveConnection.connect().then(state => {
                this.connected = true;
                logger.info(`Connected to roomId ${state.roomId}`);
            }).catch(err => {
                if (err.message === 'LIVE has ended') {
                    return;
                } else {
                    logger.error(`Error connecting to TikTok: ${err}`);
                }
            })

            // Disconnect from the chat
            this.tiktokLiveConnection.on('streamEnd', (actionId) => {
                if (actionId === 3) {
                    console.log('Stream ended by user');
                    logger.info('Stream ended by user');
                }
                if (actionId === 4) {
                    console.log('Stream ended by platform moderator (ban)');
                    logger.info('Stream ended by platform moderator (ban)');
                }
            })

            // Listen to chat messages
            this.tiktokLiveConnection.on('chat', data => {
                console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
                webSocket.tiktokChatMessage(data.comment, data.uniqueId);
            })

            // Receive gifts sent to the streamer
            this.tiktokLiveConnection.on('gift', data => {
                console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
            })

            // Recieve likes sent to the streamer
            this.tiktokLiveConnection.on('like', data => {
                cache.set('tiktokLikes', data.totalLikeCount);
                console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
            })

            // Receive new followers
            this.tiktokLiveConnection.on('follow', (data) => {
                console.log(data.uniqueId, "followed!");
            })

            // Receive shares
            this.tiktokLiveConnection.on('share', (data) => {
                console.log(data.uniqueId, "shared the stream!");
            })

            // Receive new members
            this.tiktokLiveConnection.on('member', data => {
                console.log(`${data.uniqueId} joins the stream!`);
                // tiktokLiveConnection.sendChatMessage(`Welcome to the stream ${data.userId}!`);
            })
            cache.set('tiktokConnected', true);
        }
        catch (err) {
            logger.error(`Error initializing TikTok connection: ${err}`);
        }
    }

    // Method to increase the amount of likes given by a user
    async increaseUserLikes(uniqueId, likesCount) {
        try {
            const tikTokViewers = cache.get('tiktokViewers');
            if (tikTokViewers.some(viewer => viewer.uniqueId === uniqueId)) {
                const viewer = tikTokViewers.find(viewer => viewer.uniqueId === uniqueId);
                viewer.likes += likesCount;
                cache.set('tiktokViewers', tikTokViewers);
            } else {
                tikTokViewers.push({ uniqueId: uniqueId, likes: likesCount });
                cache.set('tiktokViewers', tikTokViewers);
            }
            // If the user total likes are greater than 100, then add 100 likes to the user in the database and subtract 100 from the user total likes
            if (viewer.likes >= this.tikTokLikesThreshold) {
                await usersDB.increaseTikTokLikes(uniqueId, this.tikTokLikesThreshold);
                viewer.likes -= this.tikTokLikesThreshold;
            };
            cache.set('tiktokViewers', tikTokViewers);
        }
        catch (err) {
            logger.error(`Error increasing user likes: ${err}`);
        }
    }

    // Method to increase streame likes
    async increaseStreameLikes(likesCount) {
        try {
            const likes = cache.get('tiktokLikes');
            const newLikes = likes + likesCount;
            if (newLikes >= this.tikTokLikesThreshold) {
                await usersDB.increaseTikTokLikes('streamer', this.tikTokLikesThreshold);
                newLikes -= this.tikTokLikesThreshold;
            };
            cache.set('tiktokLikes', newLikes);
        }
        catch (err) {
            logger.error(`Error increasing streamer likes: ${err}`);
        }
    }

    // Update a goal for a specific metric
    async updateGoal(metric, goal) {
        try {
            const settings = await this.getAllSettings();
            const setting = settings.find(setting => setting.id === metric);
            const res = await this.dbConnection.collection(this.collection).findOneAndUpdate({ id: metric }, { $set: { goal: goal } }, { returnOriginal: false });
            await this.getAllSettings();
            return res;
        }
        catch (err) {
            logger.error(`Error updating goal: ${err}`);
        }
    }

    // TikTok like handler
    async tikTokLikeHandler(totalLikeCount, userData) {
        try {
            increaseUserLikes(userData.uniqueId, userData.likeCount);
            const currentLikeCount = cache.get('tiktokLikes');
        }
        catch (err) {
            logger.error(`Error in TikTok like handler: ${err}`);
        }
    }

    // Method to disconnect from the chat
    async disconnectTikTok() {
        try {
            await this.tiktokLiveConnection.disconnect();
            this.connected = false;
            cache.set('tiktokConnected', false);
            logger.info('Disconnected from TikTok');
        }
        catch (err) {
            logger.error(`Error disconnecting from TikTok: ${err}`);
        }
    }

    // Method to toggle the connection
    async toggleTikTokConnection() {
        try {
            if (this.connected) {
                await this.disconnectTikTok();
            } else {
                await this.initializeTikTokConnection();
            }
        }
        catch (err) {
            logger.error(`Error toggling TikTok connection: ${err}`);
        }
    }
}