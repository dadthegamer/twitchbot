import { goalDB, usersDB, interactionsDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";
import { addBitsToUser } from "../../actionHandlers/bitsWar.js";


// Cheer events handler
export async function onBits(e) {
    try {
        const { userDisplayName, userId, bits } = await e;
        const userData = e.getUser();
        const profileImage = userData.profilePictureUrl;
        await goalDB.increaseBitsGoals(bits);
        // Format the bits to be displayed with commas
        const formattedBits = bits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        addAlert(userId, userDisplayName, 'cheer', `${userDisplayName} cheered ${formattedBits} bits!`, profileImage);
        await usersDB.increaseBits(userId, bits);
        await interactionsDB.handleBits(bits);
        logger.info(`Cheer event: ${userDisplayName} cheered ${bits} bits!`);
        if (cache.get('bitsWar')) {
            addBitsToUser(userId, userDisplayName, profileImage, bits);
        };
    }
    catch (error) {
        logger.error(`Error in onBits: ${error}`);
    }
}