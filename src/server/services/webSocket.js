import { WebSocketServer } from 'ws';
import { getRandomInt } from '../utilities/utils.js';
import logger from '../utilities/logger.js';
import { cache, chatClient, twitchApi } from '../config/initializers.js';


let connectedDevices = 0;
// Calss for the WebSocket server
export class WebSocket {
    constructor() {
        this.wss = new WebSocketServer({ port: 8080 });
        this.wss.on('listening', () => {
            logger.info('WebSocket server started on port 8080...');
        });
        this.wss.on('connection', (ws) => {
            this.subsUpdate();
            const tvMessage = cache.get('displayMessage');
            if (tvMessage) {
                this.displayMessage(tvMessage);
            };
            this.streamUpdate(cache.get('streamInfo'));
            connectedDevices++;
            this.notification({ 
                notification: 'Connected to websocket',
                classification: 'info',
                read: false,
                createdAt: new Date()
                });
            console.log(`Client Connected | Connected devices: ${connectedDevices}`);
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    if (data.type === 'chatMessage') {
                        if (data.payload.service === 'twitch') {
                            chatClient.say(data.payload.message);
                        } else if (data.payload.service === 'tiktok') {
                            console.log(data.payload);
                        }
                    } else if (data.type === 'displayMessage') {
                        cache.set('tvMessage', data.payload.message);
                        this.displayMessage();
                    }
                } catch (error) {
                    logger.error(`Error parsing message in websocket: ${error}`);
                }
            });
            ws.on('close', () => {
                connectedDevices--;
                console.log(`Client disconnected | Connected devices: ${connectedDevices}`);

            });
        });
    }

    // Method to send a message to the client
    broadcastMessage(type, payload) {
        try {
            const message = JSON.stringify({ type, payload });
            this.wss.clients.forEach((client) => {
                client.send(message);
            });
        } catch (error) {
            logger.error(`Error sending message in websocket: ${error}`);
        }
    }

    // Method to send a message to the client
    stopWebSocketServer() {
        this.wss.close(() => {
            logger.info('WebSocket server stopped...');
        });
    }

    // Method to get the WebSocket server
    getWebSocketServer() {
        return this.wss;
    }

    // Method to get the WebSocket clients
    getWebSocketClients() {
        return this.wss.clients;
    }

    // Method to send welcome message
    welcomeMessage(payload) {
        this.broadcastMessage('welcome', payload);
    }

    // Method to send an alert
    async alert(payload) {
        this.broadcastMessage('alert', payload);
    }

    async highlightedMessage(payload) {
        this.broadcastMessage('highlightedMessage', payload);
    }

    // Method to send a new TTS message
    async TTS(data) {
        try {
            const payload = {
                id: getRandomInt(100000, 999999),
                img: data.img,
                message: data.message,
            }
            this.broadcastMessage('tts', payload);
        } catch (error) {
            logger.error(`Error sending TTS message in websocket: ${error}`);
        }
    }

    // Method to send sub update
    async subsUpdate() {
        try {
            const data = cache.get('goals');
            const monthlySubsData = data.find(goal => goal.name === 'monthlySubGoal');
            const monthlySubs = monthlySubsData.current;
            const monthlySubGoal = monthlySubsData.goal;
    
            const streamSubsData = data.find(goal => goal.name === 'dailySubGoal');
            const streamSubs = streamSubsData.current;
            const streamSubGoal = streamSubsData.goal;
    
    
            const payload = {
                monthlySubs,
                monthlySubGoal,
                streamSubs,
                streamSubGoal,
            }
            this.broadcastMessage('subsUpdate', payload);
        } catch (error) {
            logger.error(`Error sending subs update in websocket: ${error}`);
        }
    }

    // Method to send a new notification
    notification(payload) {
        this.broadcastMessage('notification', payload);
    }

    // Method to send a streamathon update
    streamathonUpdate(payload) {
        this.broadcastMessage('streamathonUpdate', payload);
    }

    // Method to send a chat message from twitch chat
    twitchChatMessage(payload) {
        this.broadcastMessage('chatMessage', payload);
    }

    // Method to send a chat message from tiktok chat
    tiktokChatMessage(message, username) {
        const payload = {
            message,
            username,
            service: 'tiktok',
        };
        this.broadcastMessage('chatMessage', payload);
    }

    // Method to send a message to the display
    async displayMessage(message) {
        const payload = {
            message,
        };
        this.broadcastMessage('displayMessage', payload);
    }

    // Method to send a video to the display
    displayVideo(videoUrl) {
        const payload = {
            videoUrl,
        };
        this.broadcastMessage('displayVideo', payload);
    }

    // Method to send when a user has arrived
    async userArrived(userId, displayName) {
        const userData = await twitchApi.getUserDataById(userId);
        const profilePic = userData.profilePictureUrl;
        const payload = {
            userId,
            displayName,
            profilePic,
        };
        this.broadcastMessage('userArrived', payload);
    }

    // Method to send when the stream goes live
    async streamLive(streamInfo) {
        const payload = {
            live: true,
            streamInfo,
        };
        this.broadcastMessage('streamLive', payload);
    }

    // Method to send a stream update
    async streamUpdate(streamInfo) {
        const payload = {
            live: true,
            streamInfo,
        };
        this.broadcastMessage('streamUpdate', payload);
    }

    // Method to send the prediction data
    async prediction(data) {
        const payload = {
            data,
        };
        this.broadcastMessage('prediction', payload);
    }

    // Method to send a sound to play
    async sound(sound) {
        const payload = {
            sound,
        };
        this.broadcastMessage('sound', payload);
    }
}