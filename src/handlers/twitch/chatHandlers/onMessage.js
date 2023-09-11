import { cache } from "../../../config/initializers.js";
import { writeToLogFile } from "../../../utilities/logging.js";
import { environment } from "../../../config/environmentVars.js";
import { firstMessageHandler } from "./firstMessageHandler.js";
import { activeUsersCache } from "../../../config/initializers.js";
import { commandHandler } from "../../../config/initializers.js";
import { knownBots } from "../viewTimeHandler.js";


// Message Handler
export async function onMessageHandler(channel, user, message, msg, bot) {
    try {
        let first = cache.get('first');
        const { isFirst, isHighlighted, userInfo, id, isReply, isCheer } = msg;
        const { userId, displayName, color, isVip, isSubscriber, isMod } = userInfo;
        const parts = message.split(' ');
        const prefix = '!';
        const command = parts[0];
        if (command.startsWith(prefix)) {
            commandHandler.commandHandler(command, parts, channel, user, message, msg, bot);
        }
        if (environment === 'production') {
            if (knownBots.has(userId)) {
                return;
            }
        }
        if (first.length < 3) {
            firstMessageHandler({ bot, msg, user, message, userDisplayName: displayName, userId, id });
        }

        // Add the user to the active users cache if they are not already in it
        if (!activeUsersCache.getActiveUser(userId)) {
            activeUsersCache.addActiveUser(userId, displayName, color, user);
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in messageHandler: ${err}`)
        console.error('Error in messageHandler:', err);
    }
}