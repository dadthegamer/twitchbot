import { usersDB, cache, streamDB } from "../../../config/initializers.js";
import { writeToLogFile } from "../../../utilities/logging.js"
import { addAlert } from "../../../handlers/alertHandler.js";

// Gift subscription events
export async function onGiftSubscription(e) {
    try {
        const user = e.gifterDisplayName;
        const tier = e.tier / 1000;
        const id = e.gifterId;
        const amount = e.amount;
        const userData = await e.getGifter();
        const profileImage = userData.profilePictureUrl;
        cache.set('streamSubs', cache.get('streamSubs') + amount);
        await addAlert('giftedsub', `${user} gifted ${amount} subscription(s) at tier ${tier}!`, profileImage);
        await usersDB.increaseSubs(id, amount);
        await streamDB.increaseStreamProperty('subs', amount);
        writeToLogFile('info', `User ${user} gifted ${amount} subscription at tier ${tier}`);
    }
    catch (error) {
        writeToLogFile('error', `Error in onGiftSubscription: ${error}`);
    }
}