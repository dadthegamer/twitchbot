import { usersDB, cache } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


//Subscription events
export async function onSubscription(e) {
    try {
        const { userName, userDisplayName, userId, cumulativeMonths, durationMonths, streakMonths } = await e;
        const tier = e.tier / 1000;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        usersDB.setUserValue(e.userId, 'cumulativeMonths', cumulativeMonths);
        usersDB.setUserValue(e.userId, 'durationMonths', durationMonths);
        usersDB.setUserValue(e.userId, 'streakMonths', streakMonths);
        addAlert(userId, userDisplayName, 'resub', `${userDisplayName} re-subscribed at tier ${tier}!`, profileImage);
        logger.info(`Subscription event: ${userDisplayName} re-subscribed at tier ${tier}!`);
    }
    catch (error) {
        logger.error(`Error in onSubscription: ${error}`);
    }
}