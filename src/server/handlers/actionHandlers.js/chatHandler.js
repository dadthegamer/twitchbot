import { chatClient } from '../../config/initializers.js';
import { variableHandler } from '../variablesHandler.js';
import logger from '../../utilities/logger.js';

export async function chatMessageHandler(message, context) {
    try {
        const { bot, msg, userDisplayName, userId, say, timeout, reply } = context;
        const { id, isFirst, isCheer, isReply, bits, userInfo } = msg;
        if (message.includes('$')) {
            try {
                const newMessage = await variableHandler(message, userId);
                console.log('New message:', newMessage);
                chatClient.replyToMessage(newMessage, id);
            } catch (err) {
                logger.error(`Error in variableHandler: ${err}`);
            }
        } else {
            chatClient.say(message);
        }
    }
    catch (err) {
        console.log('Error in chatHandler:', err);
        logger.error(`Error in chatHandler: ${err}`);
    }
}