import { chatMessageHandler } from "./actionHandlers/chatHandler.js";
import logger from "../utilities/logger.js";
import { replyHandler } from "./actionHandlers/replyHandler.js";
import { variableHandler } from "./variablesHandler.js";
import { displayHandler } from "./actionHandlers/displayHandler.js";
import { spinHandler } from "./actionHandlers/spinHandler.js";
import { addToQueue, removeFromQueue, getQueue } from "./actionHandlers/queue.js";


// Method to evaluate the handler
export async function actionEvalulate(handler, context) {
    try {
        const { userDisplayName, userId } = context;
        const { type, response } = handler;
        if (response.includes('$')) {
            const newResponse = await variableHandler(response, userId);
            handler.response = newResponse;
        }
        switch (type) {
            case 'chat':
                chatMessageHandler(handler.response);
                break;
            case 'reply':
                const { messageID } = context
                replyHandler(handler.response, messageID);
                break;
            case 'display':
                displayHandler(handler.response);
                break;
            case 'spin':
                spinHandler(userDisplayName, userId);
                break;
            case 'queue':
                const { action } = handler;
                switch (action) {
                    case 'add':
                        addToQueue(userDisplayName);
                        break;
                    case 'remove':
                        removeFromQueue(userDisplayName);
                        break;
                    case 'get':
                        getQueue();
                        break;
                    default:
                        logger.error(`Queue action not found: ${action}`);
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