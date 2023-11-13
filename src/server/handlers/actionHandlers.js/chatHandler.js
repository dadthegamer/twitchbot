import { chatClient } from '../../config/initializers.js';
import { variableHandler } from '../variablesHandler.js';
import logger from '../../utilities/logger.js';

export async function chatMessageHandler(message, context) {
    try {
        const { userId } = context;
        if (message.includes('$')) {
            try {
                const newMessage = await variableHandler(message, userId);
                chatClient.say(newMessage);
            } catch (err) {
                logger.error(`Error in variableHandler: ${err}`);
            }
        } else {
            chatClient.say(message);
        }
    }
    catch (err) {
        logger.error(`Error in chatHandler: ${err}`);
    }
}