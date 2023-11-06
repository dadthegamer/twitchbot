import { WebcastPushConnection } from 'tiktok-live-connector';
import logger from "../utilities/logger.js";
import { webSocket, cache } from '../config/initializers.js';


let connected = false;
let tiktokLiveConnection;

export function initializeTikTokConnection(username) {
    try {
        tiktokLiveConnection = new WebcastPushConnection(username);

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
            webSocket.tiktokChatMessage(data.comment, data.uniqueId);
        })
    
        // Receive gifts sent to the streamer
        tiktokLiveConnection.on('gift', data => {
            console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
        })
    
        // Recieve likes sent to the streamer
        tiktokLiveConnection.on('like', data => {
            cache.set('tiktokLikes', data.totalLikeCount);
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
        cache.set('tiktokConnected', true);
    }
    catch (err) {
        console.log(err);
        logger.error(`Error initializing TikTok connection: ${err}`);
    }
}

// Function to disconnect from the chat
export async function disconnectTikTok() {
    try {
        await tiktokLiveConnection.disconnect();
        connected = false;
        cache.set('tiktokConnected', false);
        logger.info('Disconnected from TikTok');
    }
    catch (err) {
        logger.error(`Error disconnecting from TikTok: ${err}`);
    }
}

// Function to toggle the connection
export async function toggleTikTokConnection() {
    try {
        if (connected) {
            await disconnectTikTok();
        } else {
            initializeTikTokConnection('marinevetmike');
        }
    }
    catch (err) {
        logger.error(`Error toggling TikTok connection: ${err}`);
    }
}