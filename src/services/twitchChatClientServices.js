import { Bot } from '@twurple/easy-bot';
import { ChatClient } from '@twurple/chat';
import { environment } from '../config/environmentVars.js';
import { onMessageHandler } from '../handlers/twitch/chatHandlers/onMessage.js';
import { writeToLogFile } from '../utilities/logging.js';
import { botClient } from '../config/initializers.js';

// Class to connect to Twitch chat
export class TwitchChatClient {
    constructor(authProvider) {
        this.authProvider = authProvider;
        this.chatClient = new ChatClient({ authProvider: this.authProvider, channels: ['dadthegam3r'] });
        this.channel = 'dadthegam3r';
    }

    // Method to connect to Twitch chat
    async connectToBotChat() {
        try {
            this.chatClient.connect();
            this.chatClient.join('dadthegam3r');
            this.chatClient.onConnect(() => {
                if (environment === 'production'){
                    writeToLogFile('info','The Dadb0t is online!');
                    this.chatClient.say('dadthegam3r', 'The Dadb0t is online!');
                } else {
                    console.log('The Dadb0t is online!')
                }
            });
            this.chatClient.onDisconnect(() => {
                writeToLogFile('info','The Dadb0t is offline! Reconnecting...')
                this.reconnect();
            });
            this.chatClient.onMessage(async (channel, user, message, msg) => {
                await onMessageHandler(channel, user, message, msg, botClient)
            });
        }
        catch (error) {
            writeToLogFile('error', `Error connecting to Twitch chat: ${error}`);
        }
    }

    // Method to say a message in chat
    async say(message) {
        try {
            this.chatClient.say(this.channel, message);
        }
        catch (error) {
            writeToLogFile('error', `Error in say method within chat client: ${error}`);
        }
    }

    // Method to send an action message in chat
    async action(message) {
        try {
            this.chatClient.action(this.channel, message);
        }
        catch (error) {
            writeToLogFile('error', `Error in action method within chat client: ${error}`);
        }
    }

    // Method to reconnect to Twitch chat
    async reconnect() {
        try {
            this.chatClient.reconnect();
        }
        catch (error) {
            writeToLogFile('error', `Error in reconnect method within chat client: ${error}`);
        }
    }
}