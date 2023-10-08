import { usersDB, cache, streamDB, currencyDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


//Subscription events
export async function onSubscription(e) {
    try {
        const userName = e.userName;
        const userDisplayName = e.userDisplayName;
        const userId = e.userId;
        const tier = e.tier / 1000;
        const cumulativeMonths = e.cumulativeMonths;
        const durationMonths = e.durationMonths;
        const streakMonths = e.streakMonths;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        await usersDB.setUserValue(e.userId, 'cumulativeMonths', cumulativeMonths);
        await usersDB.setUserValue(e.userId, 'durationMonths', durationMonths);
        await usersDB.setUserValue(e.userId, 'streakMonths', streakMonths);
        await addAlert('resub', `${userDisplayName} re-subscribed at tier ${tier}!`, profileImage);
        const latestSubsData = {
            id: userId,
            displayName: userDisplayName,
            login: userName,
            profileImageUrl: profileImage,
        };
        await streamDB.setLatestEvent('latestSubscriber', latestSubsData);
        await streamDB.addNewSub(userDisplayName);
        currencyDB.addCurrencyForSub(userId, 1, tier);
    }
    catch (error) {
        logger.error(`Error in onSubscription: ${error}`);
    }
}