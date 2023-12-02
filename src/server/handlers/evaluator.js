import { chatMessageHandler } from "./actionHandlers/chatHandler.js";
import logger from "../utilities/logger.js";
import { replyHandler } from "./actionHandlers/replyHandler.js";
import { variableHandler } from "./variablesHandler.js";
import { displayHandler } from "./actionHandlers/displayHandler.js";
import { spinHandler } from "./actionHandlers/spinHandler.js";
import { addToQueue, removeFromQueue, getQueue } from "./actionHandlers/queue.js";
import { getQuoteById, getRandomQuote, createQuote } from "./actionHandlers/quote.js";

// Method to evaluate the handler
export async function actionEvalulate(handler, context) {
    try {
        const { displayName, userId, messageID, input } = context;
        const { type, response, action } = handler;

        // Check if the response contains a variable
        if (response) {
            if (response.includes('$')) {
                const newResponse = await variableHandler(response, userId);
                handler.response = newResponse;
            };
        };
        switch (type) {
            case 'chat':
                chatMessageHandler(handler.response);
                break;
            case 'reply':
                replyHandler(handler.response, messageID);
                break;
            case 'display':
                displayHandler(handler.response);
                break;
            case 'spin':
                spinHandler(displayName, userId, messageID);
                break;
            case 'queue':
                switch (action) {
                    case 'add':
                        addToQueue(displayName);
                        break;
                    case 'remove':
                        removeFromQueue(displayName);
                        break;
                    case 'get':
                        getQueue();
                        break;
                    default:
                        logger.error(`Queue action not found: ${action}`);
                }
                break;
            case 'quote':
                switch (action) {
                    case 'get':
                        const quoteId = input.split('!quote')[1].trim();
                        if (quoteId) {
                            getQuoteById(quoteId);
                            break;
                        } else {
                            getRandomQuote();
                            break;
                        }
                    case 'create':
                        createQuote(input, displayName);
                        break;
                    default:
                        logger.error(`Quote action not found: ${action}`);
                }
                break;
            default:
                logger.error(`Handler not found: ${handler}`);
        }
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in evaluate: ${err}`);
    }
}