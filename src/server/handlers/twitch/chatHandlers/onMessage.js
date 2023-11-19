import { cache } from "../../../config/initializers.js";
import { environment } from "../../../config/environmentVars.js";
import { webSocket } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";


// Message Handler
export async function onMessageHandler(channel, user, message, msg, bot) {
    try {
        const streamData = cache.get('stream');
        const { isFirst, isHighlighted, userInfo, id, isReply, isCheer } = msg;
        const { userId, displayName, color, isVip, isSubscriber, isMod } = userInfo;
        webSocket.twitchChatMessage({ service: 'twitch', message, displayName, color });
        const parts = message.split(' ');
        const prefix = '!';
        const command = parts[0];
        if (command.startsWith(prefix)) {
            console.log('commandHandler');
            commandHandler.commandHandler(command, parts, channel, user, message, msg, bot);
        }
        await arrivalHandler({ bot, msg, user, message, userDisplayName: displayName, userId, id }, streamData);
        if (environment === 'production') {
            if (knownBots.has(userId)) {
                return;
            }
        }
        // Add the user to the active users cache if they are not already in it
        if (!activeUsersCache.getActiveUser(userId)) {
            activeUsersCache.addActiveUser(userId, displayName, color, user);
        }
    }
    catch (err) {
        logger.error(`Error in onMessageHandler: ${err}`);
    }
}