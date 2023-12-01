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
        // Format the bits to be displayed with commas
        const formattedBits = bits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        await addAlert(userId, userDisplayName, 'cheer', `${userDisplayName} cheered ${formattedBits} bits!`, profileImage);
        logger.info(`Cheer event: ${userDisplayName} cheered ${bits} bits!`);
        console.log(`Cheer event: ${userDisplayName} cheered ${bits} bits!`);
    }
    catch (error) {
        logger.error(`Error in onBits: ${error}`);
    }
}