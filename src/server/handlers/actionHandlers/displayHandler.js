import logger from '../../utilities/logger.js';
import { interactionsDB, webSocket } from '../../config/initializers.js';


export async function displayHandler(message) {
    try {
        await interactionsDB.setTvMessage(message);
        return;
    }
    catch (err) {
        logger.error(`Error in displayHandler: ${err}`);
    }
}