import logger from '../../utilities/logger.js';
import { goXLRClient } from '../../config/initializers.js';


// Function to disable an input on the GoXLR
export async function disableGoXLRInput(input) {
    try {
        await goXLRClient.disableInput(input);
    }
    catch (err) {
        logger.error(`Error in disableGoXLRInput: ${err}`);
    }
}

// Function to enable an input on the GoXLR
export async function enableGoXLRInput(input) {
    try {
        await goXLRClient.enableInput(input);
    }
    catch (err) {
        logger.error(`Error in enableGoXLRInput: ${err}`);
    }
}