import { chatMessageHandler } from "./actionHandlers.js/chatHandler.js";
import { spinHandler } from "./actionHandlers.js/spinHandler.js";
import { ttsHandler } from "./actionHandlers.js/ttsHandler.js";
import { usersDB, interactionsDB } from "../config/initializers.js";
import logger from "../utilities/logger.js";
import { replyHandler } from "./actionHandlers.js/replyHandler.js";


// Method to evaluate the handler
export async function evalulate(handler, context) {
    const { bot, msg, userDisplayName, userId, messageID, parts, input, rewardId } = context;
    try {
        const { type } = handler;
        switch (type) {
            case 'chat':
                chatMessageHandler(handler.response, context);
                break;
            case 'reply':
                replyHandler(handler.response, messageID);
                break;
            case 'spin':
                spinHandler(userDisplayName, userId, messageID);
                break;
            case 'tts':
                const profile_image = await usersDB.getUserProfileImageUrl(userId);
                ttsHandler(handler.response, profile_image);
                break;
            case 'getQuote':
                try {
                    const command = parts[0];
                    const split = command.split(' ');
                    const quoteIndex = split[0].replace(/[^0-9]/g, '');
                    const quoteData = await interactionsDB.getQuoteById(quoteIndex);
                    if (quoteData) {
                        const { text, creator } = quoteData;
                        const quote = `"${text}" - ${creator}`;
                        chatMessageHandler(quote, context);
                        break;
                    } else {
                        return;
                    }
                }
                catch (err) {
                    logger.error(`Error in getQuote: ${err}`);
                }
            case 'createQuote':
                try {
                    const quote = input;
                    if (!quote) {
                        return;
                    }
                    const quoteCreator = userDisplayName;
                    const res = await interactionsDB.createQuote(quote, quoteCreator);
                    if (res) {
                        const quoteId = res.id;
                        chatMessageHandler(`@${userDisplayName} created a quote: "${quote}" with a quote id of ${quoteId}`, context);
                        break;
                    } else {
                        return;
                    }
                }
                catch (err) {
                    logger.error(`Error in createQuote: ${err}`);
                }
            default:
                console.log(`Handler not found: ${handler}`);
                logger.error(`Handler not found: ${handler}`);
        }
    }
    catch (err) {
        logger.error(`Error in evaluate: ${err}`);
    }
}