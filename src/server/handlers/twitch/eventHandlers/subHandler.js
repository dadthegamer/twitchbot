import { usersDB, cache } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


//Subscription events
export async function onSubscription(e) {
    try {
        const { userName, userDisplayName, userId, cumulativeMonths, durationMonths, streakMonths } = e;
        const tier = e.tier / 1000;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        await usersDB.setUserValue(e.userId, 'cumulativeMonths', cumulativeMonths);
        await usersDB.setUserValue(e.userId, 'durationMonths', durationMonths);
        await usersDB.setUserValue(e.userId, 'streakMonths', streakMonths);
        await addAlert(userId, 'resub', `${userDisplayName} re-subscribed at tier ${tier}!`, profileImage);
        logger.info(`Subscription event: ${userDisplayName} re-subscribed at tier ${tier}!`);
    }
    catch (error) {
        logger.error(`Error in onSubscription: ${error}`);
    }
}