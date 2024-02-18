import logger from '../../utilities/logger.js';
import { webSocket, chatClient } from '../../config/initializers.js';
import { rateForeheadJoke } from '../../services/openAi.js';


export async function rateForeheadJokeHandler(displayName, joke) {
    try {
        const response = await rateForeheadJoke(joke);
        const { rating } = response;
        webSocket.TTS(`I rate that joke as ${rating} out of 10.`);
        chatClient.say(`@${displayName}, I rate that joke as ${rating} out of 10.`);
    }
    catch (error) {
        logger.error(error);
    }
}