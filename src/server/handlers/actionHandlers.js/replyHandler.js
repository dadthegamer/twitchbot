import { chatClient } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";
import { chatMessageHandler } from "./chatHandler.js";

export async function replyHandler(message, id) {
    try {
        if (id !== null || id !== undefined) {
            await chatClient.replyToMessage(message, id);
            return;
        } else {
            chatMessageHandler(message);
            return;

        }
    }
    catch (err) {
        logger.error(`Error in replyHandler: ${err}`);
    }
}