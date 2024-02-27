import { goalDB, usersDB, eventServices, twitchApi } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Gift subscription events
export async function onGiftSubscription(e) {
    try {
        const { gifterDisplayName, gifterId, amount } = e;
        const tier = e.tier / 1000;

        const userData = e.getGifter();
        const profileImage = userData.profilePictureUrl;

        // User database operations
        await goalDB.increaseSubGoals(amount);

        // Sent alert
        addAlert(gifterId, gifterDisplayName, 'giftedSub', `${gifterDisplayName} gifted ${amount} tier ${tier} subs!`, profileImage);
        usersDB.increaseSubs(gifterId, amount);
        logger.info(`Gift subscription event: ${gifterDisplayName} gifted ${amount} tier ${tier} subs!`);
        eventServices.handleEvent('onGiftSubscription', { gifterId, gifterDisplayName, amount, tier });
        if (amount >= 5) {
            twitchApi.shoutoutUser(gifterId);
        };
    }
    catch (error) {
        logger.error(`Error in onGiftSubscription: ${error}`);
    }
}