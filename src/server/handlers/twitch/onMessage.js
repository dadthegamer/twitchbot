import { webSocket, commandHandler, activeUsersCache, interactionsDB } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";
import { arrivalHandler } from "./arrivalHandler.js";
import { addHighlightedAlert } from "../highlightedMessageHandler.js";


// Message Handler
export async function onMessageHandler(channel, user, message, msg) {
    try {
        const { isFirst, isHighlight, userInfo, id, isReply, isCheer, isReturningChatter } = msg;
        const { userId, displayName, color, isVip, isSubscriber, isMod, isBroadcaster } = userInfo;
        webSocket.twitchChatMessage({ service: 'twitch', message, displayName, color });
        activeUsersCache.addUser(userId);
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
        if (isSubscriber || isVip || isMod || isBroadcaster) {
            if (parts[0].toLowerCase() === '@thedadb0t') {
                // Get the content of the message after the first word
                const messageContent = parts.slice(1).join(' ');
                interactionsDB.sarcasticResponseHandler(messageContent, userId, displayName);
            }
        }
    }
    catch (err) {
        logger.error(`Error in onMessageHandler: ${err}`);
    }
}