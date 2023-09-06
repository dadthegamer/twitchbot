// server.js
import { WebSocketServer } from 'ws';
import { writeToLogFile } from '../utilities/logging.js';
import { getRandomInt } from '../utilities/utils.js';

// Calss for the WebSocket server
export class WebSocket {
    constructor() {
        this.wss = new WebSocketServer({ port: 8080 });
        this.wss.on('connection', (ws) => {
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
            id: getRandomInt(100000, 999999),
            img: data.img,
            message: data.message,
        }
        this.broadcastMessage('tts', payload);
    }
}