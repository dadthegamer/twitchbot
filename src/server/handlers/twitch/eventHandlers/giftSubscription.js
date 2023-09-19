import { streamDB, currencyDB, usersDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Gift subscription events
export async function onGiftSubscription(e) {
    try {
        const { gifterDisplayName, gifterId, amount } = e;
        const tier = e.tier / 1000;
        const userData = await e.getGifter();
        const profileImage = userData.profilePictureUrl;

        // User database operations
        await currencyDB.addCurrencyForSub(gifterId, amount, tier);

        // Stream database operations
        await streamDB.increaseStreamProperty('subs', amount);
        await addAlert('giftedsub', `${user} gifted ${amount} subscription(s) at tier ${tier}!`, profileImage);
    }
    catch (error) {
        logger.error(`Error in onGiftSubscription: ${error}`);
    }
}