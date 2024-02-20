import logger from '../../utilities/logger.js';
import { twitchApi, cache } from '../../config/initializers.js';


// Function to start a prediction
export async function startPrediction(title, outcomes) {
    try {
        twitchApi.createPrediction(title, outcomes);
    } catch (error) {
        logger.error(error);
        return error;
    }
}

// Function to end a prediction
export async function endPrediction(outcome) {
    try {
        const predictionData = cache.get('prediction');
        // Find the outcome ID that matches the outcome title. Make it lowercase to avoid case sensitivity
        const outcomeId = predictionData.outcomes.find((o) => o.title.toLowerCase() === outcome.toLowerCase()).id;
        twitchApi.endPrediction(outcomeId);
    } catch (error) {
        logger.error(error);
        return error;
    }
}


// Function to cancel a prediction
export async function cancelPrediction() {
    try {
        twitchApi.cancelPrediction();
    } catch (error) {
        logger.error(error);
        return error;
    }
}