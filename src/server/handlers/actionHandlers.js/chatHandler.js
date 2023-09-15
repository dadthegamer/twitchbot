import { chatClient } from '../../config/initializers.js';
import { writeToLogFile } from '../../utilities/logging.js';


export async function chatMessageHandler(message, context) {
    try {
        const { bot, msg, userDisplayName, userId, say, timeout, reply } = context;
        if (message.includes('$')) {
            try {
                console.log('message', message);
                // const newMessage = await variableHandler(message, userId);
                // BotClient.say('dadthegam3r', newMessage);
            } catch (err) {
                writeToLogFile('error', `Error in chatHandler: ${err}`);
            }
        } else {
            chatClient.say(message);
        }
    }
    catch (err) {
        console.log('Error in chatHandler:', err);
        writeToLogFile('error', `Error in chatHandler: ${err}`);
    }
}