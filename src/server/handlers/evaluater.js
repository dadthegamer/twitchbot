import { chatMessageHandler } from "./actionHandlers.js/chatHandler.js";
import { spinHandler } from "./actionHandlers.js/spinHandler.js";
import { ttsHandler } from "./actionHandlers.js/ttsHandler.js";
import { usersDB } from "../config/initializers.js";
import logger from "../utilities/logger.js";
import { replyHandler } from "./actionHandlers.js/replyHandler.js";

// Method to evaluate the handler
export async function evalulate(handler, context) {
    const { bot, msg, userDisplayName, userId, say, timeout, reply, messageID } = context;
    try {
        const { type } = handler;
        switch (type) {
            case 'chat':
                chatMessageHandler(handler.response, context);
                break;
            case 'reply':
                console.log('Reply handler');
                replyHandler(handler.response, messageID);
                break;
            case 'spin':
                console.log('Spin handler');
                spinHandler(userDisplayName, userId, messageID);
                break;
            case 'tts':
                const profile_image = await usersDB.getUserProfileImageUrl(userId);
                ttsHandler(handler.response, profile_image);
                break;
            default:
                console.log(`Handler not found: ${handler}`);
                logger.error(`Handler not found: ${handler}`);
        }
    }
    catch (err) {
        logger.error(`Error in evaluate: ${err}`);
    }
}