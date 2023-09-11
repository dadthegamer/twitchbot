import { Bot } from '@twurple/easy-bot';

// Class to connect to Twitch chat
export class TwitchBotClient {
    constructor(authProvider) {
        this.authProvider = authProvider;
        this.bot = null;
        this.connectToBotChat();
        this.channel = 'dadthegam3r';
    }

    // Method to connect to Twitch chat
    async connectToBotChat() {
        try {
            const bot = new Bot({
                channels: ['dadthegam3r'],
                authProvider: this.authProvider,
                rejoinChannelsOnReconnect: true,
                isAlwaysMod: true,
            });
            this.bot = bot;
        }
        catch (error) {
            console.log(error);
        }
    }

    async replyToMessage(text, msg) {
        try {
            await this.bot.reply(this.channel, text, msg)
        }
        catch (error) {
            console.log(error);
        }
    }
}