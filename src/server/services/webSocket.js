import { WebSocketServer } from 'ws';
import { getRandomInt } from '../utilities/utils.js';
import logger from '../utilities/logger.js';
import { cache, chatClient, twitchApi, interactionsDB } from '../config/initializers.js';


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
                this.shoutout('Dadthegam3r', 'https://static-cdn.jtvnw.net/jtv_user_pictures/074e7c92-b08a-4e6b-a1c2-4e28eade69c0-profile_image-70x70.png', 'Call of Duty: Warzone');
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
                    } else if (data.type === 'miniGameWinner') {
                        interactionsDB.handleGameWin(data.game, data.payload.userId, data.payload.displayName);
                    } else if (data.type === 'addCurrencyForUsers') {
                        interactionsDB.handleCommunityGameWinWithPayout(data.game, data.payload.userIds, data.payload.payout);
                    }
                } catch (error) {
                    logger.error(`Error parsing message in websocket: ${error}`);
                }
            });
            ws.on('close', () => {
                connectedDevices--;
            });
        });
    }

    // Method to generate a date object for expiry date. Generate the date 3 minutes from now. Make sure it is a date object
    generateExpiryDate() {
        return new Date(new Date().getTime() + 180000);
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
        this.broadcastMessage('twitchChatMessage', payload);
    }

    // Method to send a chat message from tiktok chat
    tiktokChatMessage(message, username) {
        const payload = {
            message,
            username,
            service: 'tiktok',
        };
        this.broadcastMessage('tiktokChatMessage', payload);
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
            soundUrl: sound,
        };
        this.broadcastMessage('sound', payload);
    }

    // Method to send a user that plays in a mini game
    async miniGameUser(userId, displayName, color, profilePic) {
        const payload = {
            userId,
            displayName,
            profilePic,
            color,
        };
        this.broadcastMessage('miniGameUser', payload);
    }

    // Method to start a mini game
    async startMiniGame() {
        this.broadcastMessage('startGame', {});
    }
    
    // Method to reset a mini game
    async resetMiniGame() {
        this.broadcastMessage('resetGame', {});
    }

    // Method to data for the movie quote game
    async movieQuote(data) {
        const payload = {
            data,
        };
        this.broadcastMessage('movieQuote', payload);
    }

    // Method to send hype train data
    async hypeTrainUpdate(data) {
        const payload = {
            data,
        };
        this.broadcastMessage('hypeTrain', payload);
    }

    // Method to send spotify data
    async spotify(data) {
        const payload = {
            data,
        };
        this.broadcastMessage('spotify', payload);
    }

    // Method to send bits war data
    async bitsWar(data) {
        const payload = {
            data,
        };
        this.broadcastMessage('bitsWar', payload);
    }

    // Method to send a shoutout
    async shoutout(displayName, profilePic, lastSeen) {
        const payload = {
            displayName,
            profilePic,
            lastSeen,
            shoutoutLength: 10,
        };
        this.broadcastMessage('shoutout', payload);
    }
}