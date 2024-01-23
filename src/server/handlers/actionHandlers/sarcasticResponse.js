import logger from "../../utilities/logger.js";
import { chatClient, webSocket } from '../../config/initializers.js';
import { sarcasticResponse } from '../../services/openAi.js';


// Sarcastic response handler
export async function sarcasticResponseHandler(messageFromChat, userId, displayName) {
    try {
        const isOnCooldown = await cooldownHandler(userId, displayName);
        if (isOnCooldown !== true) {
            chatClient.say(`@${displayName}, you are on cooldown for ${isOnCooldown} seconds.`);
        } else {
            const response = await sarcasticResponse(messageFromChat);
            chatClient.say(response);
            webSocket.TTS({ message: response, img: null});
        }
    }
    catch (err) {
        logger.error(`Error in sarcasticResponseHandler: ${err}`);
    }
}