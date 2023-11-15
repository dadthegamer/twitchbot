import { streamDB, currencyDB, goalDB, streamathonService } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Cheer events handler
export async function onBits(e) {
    try {
        const { userDisplayName, userId, bits } = await e;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        const newCheerData = {
            id: userId,
            display_name: userDisplayName,
            profile_image_url: profileImage,
        };
        await goalDB.increaseBitsGoals(bits);
        // await streamDB.setLatestEvent('latestCheer', newCheerData);
        await addAlert(userId, userDisplayName, 'cheer', `cheered ${bits} bits!`);
        await currencyDB.addCurrencyForBits(userId, bits);
        // await streamDB.increaseStreamProperty('bits', bits);
        // await streamathonService.addToBitsTimer(bits);
        logger.info(`Cheer event: ${userDisplayName} cheered ${bits} bits!`);
    }
    catch (error) {
        logger.error(`Error in onBits: ${error}`);
    }
}