import logger from "../../utilities/logger.js";
import { chatClient } from '../../config/initializers.js';
import { sarcasticResponse } from '../../services/openAi.js';


// Sarcastic response handler
export async function sarcasticResponseHandler(messageFromChat) {
    try {
        const response = await sarcasticResponse(messageFromChat);
        chatClient.say(response);
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in sarcasticResponseHandler: ${err}`);
    }
}