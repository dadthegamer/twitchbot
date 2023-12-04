import { Bot } from '@twurple/easy-bot';
import { ChatClient } from '@twurple/chat';
import { environment, streamerUserName } from '../config/environmentVars.js';
import { onMessageHandler } from '../handlers/twitch/onMessage.js';
import logger from "../utilities/logger.js";
import { cache } from '../config/initializers.js';

// Class to connect to Twitch chat
class TwitchChatClient {
    constructor(authProvider) {
        this.authProvider = authProvider;
        this.chatClient = new ChatClient({ authProvider: this.authProvider, channels: [streamerUserName] });
        this.channel = streamerUserName;
        this.bot = new Bot({
            channels: [streamerUserName],
            authProvider: this.authProvider,
            rejoinChannelsOnReconnect: true,
            isAlwaysMod: true,
            requestMembershipEvents: true,
        });
        cache.set('twitchChatConnected', false)
        this.connectToBotChat();
    }

    // Method to connect to Twitch chat
    async connectToBotChat() {
        try {
            cache.set('twitchChatConnected', true)
            this.chatClient.connect();
            this.chatClient.join(streamerUserName);
            this.chatClient.onConnect(() => {
                console.log('Connected to Twitch chat');
                if (environment === 'production') {
                    this.chatClient.say(this.channel, 'The Dadb0t is online!');
                } else {
                    console.log('The Dadb0t is online!')
                }
            });
            this.chatClient.onDisconnect(() => {
                logger.error('Disconnected from Twitch chat');
            });
            this.chatClient.onMessage(async (channel, user, message, msg) => {
                console.log(message);
                await onMessageHandler(channel, user, message, msg)
            });
            this.chatClient.onMessageRatelimit((channel, message, msg) => {
                logger.error(`Ratelimited: ${message} - ${msg}`);
            });
            this.chatClient.onDisconnect(() => {
                cache.set('twitchChatConnected', false)
                logger.error('Disconnected from Twitch chat');
            });
        }
        catch (error) {
            logger.error(`Error connecting to Twitch chat: ${error}`);
        }
    }

    // Method to disconnect from Twitch chat
    async disconnectFromBotChat() {
        try {
            this.chatClient.quit();
            this.chatClient.part(this.channel);
            cache.set('twitchChatConnected', false)
        }
        catch (error) {
            logger.error(`Error disconnecting from Twitch chat: ${error}`);
        }
    }

    // Method to toogle the connection status of Twitch chat
    async toggleConnection() {
        try {
            if (cache.get('twitchChatConnected')) {
                this.disconnectFromBotChat();
            }
            else {
                this.connectToBotChat();
            }
        }
        catch (error) {
            logger.error(`Error toggling Twitch chat connection: ${error}`);
        }
    }

    // Method to say a message in chat
    async say(message) {
        try {
            this.chatClient.say(this.channel, message);
        }
        catch (error) {
            logger.error(`Error in say method within chat client: ${error}`);
        }
    }

    // Method to send an action message in chat
    async action(message) {
        try {
            this.chatClient.action(this.channel, message);
        }
        catch (error) {
            logger.error(`Error in action method within chat client: ${error}`);
        }
    }

    // Method to reconnect to Twitch chat
    async reconnect() {
        try {
            this.chatClient.reconnect();
        }
        catch (error) {
            logger.error(`Error in reconnect method within chat client: ${error}`);
        }
    }

    // Method to reply to a message in chat
    async replyToMessage(text, msg) {
        try {
            await this.bot.reply(this.channel, text, msg)
        }
        catch (error) {
            logger.error(`Error in replyToMessage method within chat client: ${error}`);
        }
    }
}

export default TwitchChatClient;