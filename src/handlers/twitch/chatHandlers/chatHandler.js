import { writeToLogFile } from '../../utilities/logging.js';

export async function chatHandler(message, context) {
    try {
        const { bot, msg, userDisplayName, userId, say, timeout, reply } = context;
        if (message.includes('$')) {
            try {
                const newMessage = await variableHandler(message, userId);
                BotClient.say('dadthegam3r', newMessage);
            } catch (err) {
                writeToLogFile('error', `Error in chatHandler: ${err}`);
            }
        } else {
            BotClient.say('dadthegam3r', message);
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in chatHandler: ${err}`);
    }
}