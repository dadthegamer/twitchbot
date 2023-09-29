import { WebcastPushConnection } from 'tiktok-live-connector';
import logger from "../utilities/logger.js";
import { webSocket } from '../config/initializers.js';

let connected = false;

export async function initializeTikTokConnection(username) {
    try {
        let tiktokLiveConnection = new WebcastPushConnection(username);

        // Connect to the chat
        tiktokLiveConnection.connect().then(state => {
            connected = true;
            logger.info(`Connected to roomId ${state.roomId}`);
        }).catch(err => {
            if (err.message === 'LIVE has ended') {
                return;
            } else {
                logger.error(`Error connecting to TikTok: ${err}`);
            }
        })
    
        // Disconnect from the chat
        tiktokLiveConnection.on('streamEnd', (actionId) => {
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
        tiktokLiveConnection.on('chat', data => {
            console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
        })
    
        // Receive gifts sent to the streamer
        tiktokLiveConnection.on('gift', data => {
            console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
        })
    
        // Recieve likes sent to the streamer
        tiktokLiveConnection.on('like', data => {
            console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
        })
    
        // Receive new followers
        tiktokLiveConnection.on('follow', (data) => {
            console.log(data.uniqueId, "followed!");
        })
    
        // Receive shares
        tiktokLiveConnection.on('share', (data) => {
            console.log(data.uniqueId, "shared the stream!");
        })
    
        // Receive new members
        tiktokLiveConnection.on('member', data => {
            console.log(`${data.uniqueId} joins the stream!`);
            // tiktokLiveConnection.sendChatMessage(`Welcome to the stream ${data.userId}!`);
        })
    }
    catch (err) {
        console.log(err);
        logger.error(`Error initializing TikTok connection: ${err}`);
    }
}