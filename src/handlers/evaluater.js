import { writeToLogFile } from "../utilities/logging.js";
import { chatMessageHandler } from "./actionHandlers.js/chatHandler.js";
import { spinHandler } from "./actionHandlers.js/spinHandler.js";

// Method to evaluate the handler
export async function evalulate(handler, context) {
    const { bot, msg, userDisplayName, userId, say, timeout, reply, messageID } = context;
    try {
        const { type } = handler;
        switch (type) {
            case 'chat':
                chatMessageHandler(handler.response, context);
                break;
            case 'reply':
                console.log('Reply handler');
                break;
            case 'spin':
                console.log('Spin handler');
                spinHandler(userDisplayName, userId, messageID);
                break;
            default:
                console.log(`Handler not found: ${handler}`);
                writeToLogFile('error', `Handler not found: ${handler}`);
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in eval: ${err}`);
    }
}