import { chatClient } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';


export async function chatMessageHandler(message) {
    try {
        chatClient.say(message);
    }
    catch (err) {
        logger.error(`Error in chatHandler: ${err}`);
    }
}