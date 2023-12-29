import logger from '../../utilities/logger.js';
import { twitchApi } from '../../config/initializers.js';


// Function to start a prediction
export async function startPrediction(title, outcomes) {
    try {
        twitchApi.createPrediction(title, outcomes);
    } catch (error) {
        logger.error(error);
        return error;
    }
}