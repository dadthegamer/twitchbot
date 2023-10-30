import { WebSocket } from 'ws';
import logger from '../utilities/logger.js';


class GoXLRClient {
    constructor(uri = 'ws://192.168.1.37:14564/api/websocket') {
        this.uri = uri;
        this.ws = null;
        this.connect();
    }

    connect() {
        try {
            this.ws = new WebSocket(this.uri);

            this.ws.on('open', () => {
                console.log('Connected to GoXLR API');
            });
    
            this.ws.on('message', (message) => {
                this.handleMessage(JSON.parse(message));
            });
    
            this.ws.on('error', (error) => {
                console.error(`Error: ${error.message}`);
            });
    
            this.ws.on('close', (code, reason) => {
                console.log(`Connection closed, code: ${code}, reason: ${reason}`);
            });
        }
        catch (err) {
            const message = err.message;
            // If the error message has 'ETIMEDOUT' in it, the server is offline
            if (message.includes('ETIMEDOUT')) {
                logger.error(`Error in GoXLRClient: ${err}`);
            } else {
                logger.error(`Error in GoXLRClient: ${err}`);
            }
        }
    }

    handleMessage(message) {
        if (message.data && message.data.Status) {
            console.log('Received Status:', message.data.Status);
        } else if (message.data && message.data.Patch) {
            console.log('Received Patch:', message.data.Patch);
        }
        else {
            console.log('Received:', message);
        }
    }

    getStatus() {
        const message = JSON.stringify({ id: 1, data: "GetStatus" });
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(message);
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    }

    setRouter() {
        const command = {
            id: 162,
            data: { Command: ["S201204264DI7", { "SetRouter": ["Microphone", "Headphones", true] }]}
        };
        this.sendCommand(command);
    }

    sendCommand(command) {
        return new Promise((resolve, reject) => {
            this.ws.send(JSON.stringify(command), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default GoXLRClient;