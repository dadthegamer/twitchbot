import logger from "../../utilities/logger.js";
import { interactionsDB, webSocket } from '../../config/initializers.js';


// Function to play a sound
export const playSound = async (sound) => {
    try {
        const soundData = await interactionsDB.getSound(sound);
        if (soundData.location) {
            webSocket.sound(soundData.location);
        } else {
            logger.error(`Sound not found in soundHandler: ${sound}`);
        }
    } catch (error) {
        logger.error(`Error getting sound in soundHandler: ${error}`);
    }
};