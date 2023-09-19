import logger from "../../../utilities/logger.js";
import { spinHandler } from "../../actionHandlers.js/spinHandler.js";

// Method to evaluate the handler
export async function evalulate(handler, context) {
    const { userDisplayName, userId, messageID, msg } = context;
    try {
        const { type } = handler;
        switch (type) {
            case 'chat':
                chatHandler(handler.response, context);
                break;
            case 'reply':
                console.log('Reply handler');
                break;
            case 'spin':
                spinHandler(userDisplayName, userId, messageID);
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