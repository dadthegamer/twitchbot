import { WebSocketServer } from 'ws';
import { getRandomInt } from '../utilities/utils.js';
import logger from '../utilities/logger.js';
import { cache, chatClient } from '../config/initializers.js';


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
            console.log('Client connected');
            connectedDevices++;
            this.notification({ 
                notification: 'Connected to websocket',
                classification: 'info',
                read: false,
                createdAt: new Date()
                });
            console.log(`Connected devices: ${connectedDevices}`);
            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    if (data.type === 'chatMessage') {
                        if (data.payload.service === 'twitch') {
                            console.log(data.payload);
                            chatClient.say(data.payload.message);
                        } else if (data.payload.service === 'tiktok') {
                            console.log(data.payload);
                        }
                    }
                } catch (error) {
                    logger.error(`Error parsing message in websocket: ${error}`);
                }
            });
            ws.on('close', () => {
                connectedDevices--;
                console.log('Client disconnected');
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
    alert(payload) {
        this.broadcastMessage('alert', payload);
    }

    // Method to send a new TTS message
    TTS(data) {
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
    subsUpdate() {
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
    tiktokChatMessage(payload) {
        this.broadcastMessage('chatMessage', payload);
    }
}