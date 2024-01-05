import { WebSocket } from 'ws';
import logger from '../utilities/logger.js';


class GoXLRClient {
    constructor() {
        this.uri = `ws://${process.env.STREAMING_PC_IP}:14564/api/websocket`;
        this.ws = null;
        this.reconnect();
        this.connected = false;
        this.router = {};
        this.mixer = '';
    }

    async connect() {
        try {
            if (this.connected === true) {
                return;
            } else {
                this.ws = new WebSocket(this.uri);
                this.connected = true;

                this.ws.on('open', async () => {
                    console.log('Connected to GoXLR API');
                    await this.getStatus();
                });

                this.ws.on('message', (message) => {
                    this.handleMessage(JSON.parse(message));
                });

                this.ws.on('error', (error) => {
                    if (error.message.includes('ETIMEDOUT')) {
                        this.connected = false;
                        return;
                    } else {
                        this.connected = false;
                        console.error(`Error in GoXLRClient: ${error.message}`);
                    }
                });

                this.ws.on('close', (code, reason) => {
                    if (this.connected) {
                        this.connected = false;
                        console.log(`Connection closed: ${code} ${reason}`);
                    }
                });
            }
        }
        catch (err) {
            const message = err.message;
            if (message.includes('ETIMEDOUT')) {
                return;
            } else if (message.includes('ECONNREFUSED')) {
                logger.error(`Error in GoXLRClient: ${err}`);
            } else {
                logger.error(`Error in GoXLRClient: ${err}`);
            }
        }
    }

    // Method to reconnect to the GoXLR API
    async reconnect() {
        setInterval(() => {
            try {
                if (!this.connected) {
                    this.connect();
                }
            }
            catch (err) {
                logger.error(`Error in reconnecting to GOXLR: ${err}`);
            }
        }, 5000);
    }

    async handleMessage(message) {
        try {
            if (message.data && message.data.Status) {
                // console.log('Received Status:', message.data.Status);
                if (message.data.Status.mixers) {
                    const mixers = message.data.Status.mixers;
                    // Get the first mixer in the object
                    const mixer = mixers[Object.keys(mixers)[0]];
                    // Console log the mixer key
                    this.mixer = Object.keys(mixers)[0];
                    // Convert the mixer to a string
                    this.mixer = this.mixer.toString();
                    const router = mixer.router;
                    this.router = router;
                }
            } else if (message.data && message.data.Patch) {
                // console.log('Received Patch:', message.data.Patch[0]);
                if (message.data.Patch[0].op === 'replace' && message.data.Patch[0].path) {
                    const value = message.data.Patch[0].value;
                    // If the value is a boolean, it's a mute/unmute command
                    if (typeof value === 'boolean') {
                        // Get the input from the path. The path is in the format of /mixers/0/router/input/output
                        const input = message.data.Patch[0].path.split('/')[4];
                        const output = message.data.Patch[0].path.split('/')[5];
                        // Update the router object
                        this.router[input][output] = value;
                    }

                }
            } else if (message.data === 'Ok') {
                return;
            } else {
                console.log('Received:', message);
            }
        }
        catch (err) {
            logger.error(`Error in handleMessage for goXLRService: ${err}`);
        }
    }

    async getStatus() {
        try {
            const message = JSON.stringify({ id: 1, data: "GetStatus" });
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(message);
            } else {
                console.error('WebSocket is not open. Unable to send message.');
            }
        }
        catch (err) {
            logger.error(`Error in getStatus for goXLRService: ${err}`);
        }
    }

    async setRouter(input, output, enabled) {
        try {
            if (this.connected === false) {
                logger.error('GoXLR is not connected. Unable to set router.');
                return;
            }
            // Capitalize the first letter of the input and output
            input = input.charAt(0).toUpperCase() + input.slice(1);
            output = output.charAt(0).toUpperCase() + output.slice(1);
            const command = {
                id: 162,
                data: { Command: [this.mixer, { "SetRouter": [input, output, enabled] }] }
            };
            this.sendCommand(command);
        }
        catch (err) {
            logger.error(`Error in setRouter for goXLRService: ${err}`);
        }
    }

    // Method to disable an input to the headphones
    async disableInput(input) {
        this.setRouter(input, 'headphones', false);
    }

    // Method to enable an input to the headphones
    async enableInput(input) {
        this.setRouter(input, 'headphones', true);
    }

    async sendCommand(command) {
        try {
            if (this.connected === false) {
                logger.error('GoXLR is not connected. Unable to send command.');
                return;
            } else {
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
        }
        catch (err) {
            logger.error(`Error in sendCommand for goXLRService: ${err}`);
        }
    }

    async close() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

export default GoXLRClient;