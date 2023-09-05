// server.js
import { WebSocketServer } from 'ws';
import { writeToLogFile } from '../utilities/logging.js';


// Calss for the WebSocket server
export class WebSocket {
    constructor() {
        this.wss = new WebSocketServer({ port: 8080 });
        this.wss.on('connection', (ws) => {
            this.alert({
                alertType: 'New Follower',
                alertMessage: 'Connected to WebSocket server',
                userImg: 'https://static-cdn.jtvnw.net/jtv_user_pictures/f8caf03d-99c8-440f-863a-da08a88ce97c-profile_image-70x70.png',
                sound: 'http://localhost:3001/audio/cheer.mp3',
                alertTime: 5000,
            })
            console.log('Client connected');
            ws.on('message', (message) => {
                console.log(`Received message => ${message}`);
            });
            ws.on('close', () => {
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
    startWebSocketServer() {
        this.wss.on('listening', () => {
            console.log('WebSocket server started on port 8080...');
            writeToLogFile('info', 'WebSocket server started...');
        });
    }

    // Method to send a message to the client
    stopWebSocketServer() {
        this.wss.close(() => {
            console.log('WebSocket server stopped...');
            writeToLogFile('info', 'WebSocket server stopped...');
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

    // Method to send updates when subdata is updated
    subsUpdate(payload) {
        this.broadcastMessage('subsUpdate', payload);
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
            id,
            img: data.img,
            message: data.message,
        }
        this.broadcastMessage('tts', payload);
    }
}