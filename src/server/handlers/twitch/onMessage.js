import { cache } from "../../config/initializers.js";
import { webSocket, commandHandler } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";
import { arrivalHandler } from "./arrivalHandler.js";
import { addHighlightedAlert } from "../highlightedMessageHandler.js";

// Message Handler
export async function onMessageHandler(channel, user, message, msg) {
    try {
        const { isFirst, isHighlight, userInfo, id, isReply, isCheer, isReturningChatter } = msg;
        const { userId, displayName, color, isVip, isSubscriber, isMod, isBroadcaster } = userInfo;
        const streamData = cache.get('stream');
        webSocket.twitchChatMessage({ service: 'twitch', message, displayName, color });
        const parts = message.split(' ');
        const prefix = '!';
        const command = parts[0];
        arrivalHandler({ userId, displayName, color, isVip, isSubscriber, isMod, isBroadcaster, id });
        if (command.startsWith(prefix)) {
            commandHandler.commandHandler(command, user, message, msg);
        }
        if (isHighlight) {
            addHighlightedAlert(userId, displayName, message);
        }
    }
    catch (err) {
        logger.error(`Error in onMessageHandler: ${err}`);
    }
}