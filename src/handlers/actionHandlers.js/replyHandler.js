import { botClient } from "../../config/initializers.js";
import { writeToLogFile } from "../../utilities/logging.js";


export async function replyHandler(message, id) {
    try {
        await botClient.replyToMessage(message, id);
    }
    catch (err) {
        console.log(err);
        writeToLogFile('error', `Error in replyHandler: ${err}`);
    }
}