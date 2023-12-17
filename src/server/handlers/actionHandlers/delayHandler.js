import logger from '../../utilities/logger.js';


export function delay(ms) {
    // Check if the delay is a number. If it isnt try to parse it to a number. If not throw an error.
    if (typeof ms !== 'number') {
        try {
            ms = parseInt(ms);
        } catch (error) {
            logger.error(`Delay is not a number: ${ms}`);
        }
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}