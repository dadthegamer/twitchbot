import { chatMessageHandler } from "./actionHandlers.js/chatHandler.js";
import { spinHandler } from "./actionHandlers.js/spinHandler.js";
import { ttsHandler } from "./actionHandlers.js/ttsHandler.js";
import { usersDB, interactionsDB } from "../config/initializers.js";
import logger from "../utilities/logger.js";
import { replyHandler } from "./actionHandlers.js/replyHandler.js";
import { displayHandler } from "./actionHandlers.js/displayHandler.js";
import { addToQueue, removeFromQueue, getQueue } from "./actionHandlers.js/queue.js";


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
            case 'quote':
                const quoteAction = handler.response;
                if (quoteAction === 'get') {
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
                } else if (quoteAction === 'create') {
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
                };
            case 'setMessage':
                try {
                    displayHandler(input);
                } catch (err) {
                    logger.error(`Error in setMessage: ${err}`);
                }
            case 'queue':
                if (handler.response === 'add') {
                    const res = await addToQueue(userDisplayName);
                    if (res) {
                        chatMessageHandler(`@${userDisplayName} has been added to the queue!`, context);
                        break;
                    } else {
                        chatMessageHandler(`@${userDisplayName} is already in the queue!`, context);
                        break;
                    };
                } else if (handler.response === 'remove') {
                    await removeFromQueue(userDisplayName);
                    chatMessageHandler(`@${userDisplayName} has been removed from the queue!`, context);
                    break;
                } else if (handler.response === 'get') {
                    const queue = await getQueue();
                    chatMessageHandler(`The queue is: ${queue.join(', ')}`, context);
                    break;
                };
            default:
                console.log(`Handler not found: ${handler}`);
                logger.error(`Handler not found: ${handler}`);
        }
    }
    catch (err) {
        logger.error(`Error in evaluate: ${err}`);
    }
}