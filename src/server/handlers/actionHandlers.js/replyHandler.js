import { chatClient } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";

export async function replyHandler(message, id) {
    try {
        await chatClient.replyToMessage(message, id);
    }
    catch (err) {
        logger.error(`Error in replyHandler: ${err}`);
    }
}