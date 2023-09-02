import { Bot } from '@twurple/easy-bot';

// Class to connect to Twitch chat
export class TwitchBotClient {
    constructor(authProvider) {
        this.authProvider = authProvider;
        this.bot = null;
    }

    // Method to connect to Twitch chat
    async connectToBotChat() {
        try {
            const bot = new Bot({
                channels: ['dadthegam3r'],
                authProvider: this.authProvider,
                rejoinChannelsOnReconnect: true,
                logger: {
                    minLevel: 'debug',
                    colors: true,
                },
            });
            this.bot = bot;
        }
        catch (error) {
            console.log(error);
        }
    }

    async replyToMessage(channel, text, msg) {
        try {
            await this.bot.reply(channel, text, msg)
        }
        catch (error) {
            console.log(error);
        }
    }
}