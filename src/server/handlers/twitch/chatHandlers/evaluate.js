import { writeToLogFile } from "../../../utilities/logging.js";


// Method to evaluate the handler
export async function evalulate(handler, context) {
    try {
        const { type } = handler;
        switch (type) {
            case 'chat':
                chatHandler(handler.response, context);
                break;
            case 'reply':
                console.log('Reply handler');
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