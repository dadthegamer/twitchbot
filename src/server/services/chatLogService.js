import { cache } from "../config/initializers.js";
import NodeCache from 'node-cache';
import logger from '../utilities/logger.js';

// Class to handle all stream related services
class ChatLogService {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.cache = new NodeCache({ stdTTL: 10, checkperiod: 120 });
        this.cacheThreshold = 100;
        this.streamId = null;
        this.listenForExpiredKeys();
    }

    // Listen for expired keys
    listenForExpiredKeys() {
        this.cache.on('expired', (key, value) => {
            console.log(`Key ${key} expired`);
            this.addChatLogToDB(value);
        });
    }

    // Method to get all chat logs for a stream
    async getAllChatLogsForStream(streamId) {
        try {
            const chatLogs = await this.dbConnection.collection('chatLogs').find({ streamId: streamId }).toArray();
            return chatLogs;
        } catch (error) {
            logger.error(`Error getting chat logs for stream ${streamId}: ${error}`);
        }
    }

    // Method to add a chat message to the cache
    async captureChatMessage(user, userid, message) {
        try {
            const chatMessage = {
                user: user,
                userid: userid,
                message: message,
                timestamp: new Date(),
            };
            const chatLogs = await this.cache.get('chatLogs');
            if (chatLogs === undefined) {
                this.cache.set('chatLogs', [chatMessage]);
            } else {
                chatLogs.push(chatMessage);
                this.cache.set('chatLogs', chatLogs);
            }
            if (chatLogs.length >= this.cacheThreshold) {
                this.addChatLogToDB(chatLogs);
            }
        } catch (error) {
            logger.error(`Error capturing chat message: ${error}`);
        }
    }

    // Method to add chat logs to the database
    async addChatLogToDB(chatLogs) {
        try {
            const streamId = cache.get('streamId');
            await this.dbConnection.collection('chatLogs').updateOne({
                id: streamId,
            }, {
                $push: {
                    chatLog: {
                        $each: chatLogs,
                    },
                },
            }, {
                upsert: true,
            });
        } catch (error) {
            logger.error(`Error adding chat logs to database: ${error}`);
        }
    }

    // Method to delete chat logs for a stream
    async deleteChatLogsForStream(streamId) {
        try {
            await this.dbConnection.collection('chatLogs').deleteMany({ streamId: streamId });
        } catch (error) {
            logger.error(`Error deleting chat logs for stream ${streamId}: ${error}`);
        }
    }

    // Method to create a chat log for a stream
    async createChatLogForStream() {
        try {
            const res = await this.dbConnection.collection('chatLogs').insertOne({
                chatLog: [],
            });
            this.cache.set('chatLogs', []);
            console.log(`Created chat log for stream ${res.insertedId}`);
            // Return the id of the inserted document without the ObjectId wrapper
            return res.insertedId.toString();
        } catch (error) {
            logger.error(`Error creating chat log for stream: ${error}`);
        }
    }
}

export default ChatLogService;