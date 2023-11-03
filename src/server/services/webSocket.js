import { WebSocketServer } from 'ws';
import { getRandomInt } from '../utilities/utils.js';
import logger from '../utilities/logger.js';
import { cache, goalDB } from '../config/initializers.js';


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
                console.log(`Received message => ${message}`);
            });
            ws.on('close', () => {
                connectedDevices--;
                console.log('Client disconnected');
            });
        });
    }

    // Method to send a message to the client
    broadcastMessage(type, payload) {
        const message = JSON.stringify({ type, payload });
        this.wss.clients.forEach((client) => {
            client.send(message);
        });
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
        const payload = {
            id: getRandomInt(100000, 999999),
            img: data.img,
            message: data.message,
        }
        this.broadcastMessage('tts', payload);
    }

    // Method to send sub update
    subsUpdate() {
        const data = cache.get('goals');
        const monthlySubsData = data.find(goal => goal.name === 'monthlySubGoal');
        const monthlySubs = monthlySubsData.current;

        const streamSubsData = data.find(goal => goal.name === 'dailySubGoal');
        const streamSubs = streamSubsData.current;
        const payload = {
            monthlySubs,
            streamSubs,
        }
        this.broadcastMessage('subsUpdate', payload);
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