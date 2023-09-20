import { streamDB, currencyDB, goalDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Cheer events handler
export async function onBits(e) {
    try {
        const { userDisplayName, userId, bits } = e;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        const newCheerData = {
            id: userId,
            display_name: userDisplayName,
            profile_image_url: profileImage,
        };
        await goalDB.increaseBitsGoals(bits);
        await streamDB.setLatestEvent('latestCheer', newCheerData);
        await addAlert('cheer', `${userDisplayName} cheered ${bits} bits!`, profileImage);
        await currencyDB.addCurrencyForBits(userId, bits);
        await streamDB.increaseStreamProperty('bits', bits);
    }
    catch (error) {
        logger.error(`Error in onBits: ${error}`);
    }
}