import { webSocket, commandHandler, activeUsersCache, interactionsDB, usersDB, cache } from "../../config/initializers.js";
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
        usersDB.increaseChatMessages(userId);
        // Find out if the user is using an emote by checking if the message contains the channel emotes name. The channel emotes are stored in the cache as 'channelEmotes' as an array of obects with the properties 'id' and 'emoteName'. 
        const emote = cache.get('channelEmotes').find(emote => message.includes(emote.emoteName));
        if (emote) {
            // Need to find out how many emotes are being used in the message
            const emoteCount = message.split(emote.emoteName).length - 1;
            usersDB.increaseEmotesUsed(userId, emoteCount);
        }
    }
    catch (err) {
        logger.error(`Error in onMessageHandler: ${err}`);
    }
}