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

        // Cache operations
        cache.set('streamSubs', cache.get('streamSubs') + amount);
        cache.set('monthlySubs', cache.get('monthlySubs') + amount);

        // User database operations
        await usersDB.increaseSubs(id, amount);
        await usersDB.increaseUserValue(id, 'leaderboard_points', (5000*tier));

        // Stream database operations
        await streamDB.increaseStreamProperty('subs', amount);
        await streamDB.increaseStreamProperty('gifted_subs', amount);
        await streamDB.increaseStreamProperty('total_subs', amount);
        await addAlert('giftedsub', `${user} gifted ${amount} subscription(s) at tier ${tier}!`, profileImage);
        writeToLogFile('info', `User ${user} gifted ${amount} subscription at tier ${tier}`);
    }
    catch (error) {
        writeToLogFile('error', `Error in onGiftSubscription: ${error}`);
    }
}