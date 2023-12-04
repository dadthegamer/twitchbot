import { cache } from "../../config/initializers.js";
import { environment } from "../../config/environmentVars.js";
import { webSocket, commandHandler } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";


// Message Handler
export async function onMessageHandler(channel, user, message, msg) {
    try {
        const { isFirst, isHighlight, userInfo, id, isReply, isCheer, isReturningChatter } = msg;
        const { userId, displayName, color, isVip, isSubscriber, isMod, isBroadcaster } = userInfo;
        console.log(message);
        const streamData = cache.get('stream');
        webSocket.twitchChatMessage({ service: 'twitch', message, displayName, color });
        const parts = message.split(' ');
        const prefix = '!';
        const command = parts[0];
        if (command.startsWith(prefix)) {
            commandHandler.commandHandler(command, user, message, msg);
        }
    }
    catch (err) {
        logger.error(`Error in onMessageHandler: ${err}`);
    }
}