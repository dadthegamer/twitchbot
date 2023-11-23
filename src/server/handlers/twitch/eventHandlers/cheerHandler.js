import { goalDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Cheer events handler
export async function onBits(e) {
    try {
        const { userDisplayName, userId, bits } = await e;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        await goalDB.increaseBitsGoals(bits);
        await addAlert(userId, userDisplayName, 'cheer', `cheered ${bits} bits!`, profileImage);
        logger.info(`Cheer event: ${userDisplayName} cheered ${bits} bits!`);
        console.log(`Cheer event: ${userDisplayName} cheered ${bits} bits!`);
    }
    catch (error) {
        logger.error(`Error in onBits: ${error}`);
    }
}