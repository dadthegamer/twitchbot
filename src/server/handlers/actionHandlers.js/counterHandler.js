import { variableHandler } from '../variablesHandler.js';
import logger from '../../utilities/logger.js';
import { counterService } from '../../config/initializers.js';


// Function to increase a counter
export async function increaseCounter(counter, value) {
    try {
        // Increase the counter in the cache and the database
        const result = await counterService.increaseCounter(counter, value);
        return result;
    }
    catch (err) {
        logger.error(`Error in increaseCounter: ${err}`);
    }
}

// Function to decrease a counter
export async function decreaseCounter(counter, value) {
    try {
        // Decrease the counter in the cache and the database
        const result = await counterService.decreaseCounter(counter, value);
        return result;
    }
    catch (err) {
        logger.error(`Error in decreaseCounter: ${err}`);
    }
}

// Function to set a counter
export async function setCounter(counter, value) {
    try {
        // Set the counter in the cache and the database
        const result = await counterService.setCounter(counter, value);
        return result;
    }
    catch (err) {
        logger.error(`Error in setCounter: ${err}`);
    }
}