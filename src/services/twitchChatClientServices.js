import { Bot } from '@twurple/easy-bot';
import { ChatClient } from '@twurple/chat';
import { environment } from '../config/environmentVars.js';
import { onMessage } from '../handlers/twitch/chatHandlers/onMessage.js';
import { writeToLogFile } from '../utils/logging.js';

// Class to connect to Twitch chat
export class TwitchChatClient {
    constructor(authProvider) {
        this.authProvider = authProvider;
    }

    // Method to connect to Twitch chat
    async connectToBotChat() {
        try {
            const chatClient = new ChatClient({ authProvider: this.authProvider, channels: ['dadthegam3r'] });
            chatClient.connect();
            chatClient.join('dadthegam3r');
            chatClient.onConnect(() => {
                console.log('Bot connected to chat!');
            });
            chatClient.onMessage(async (channel, user, message, msg) => {
                await onMessage(channel, user, message, msg)
            });
            if (environment === 'production'){
                chatClient.say('dadthegam3r', 'The Dadb0t is online!');
            } else {
                console.log('The Dadb0t is online!')
            }
        }
        catch (error) {
            writeToLogFile('error', `Error connecting to Twitch chat: ${error}`);
        }
    }
}