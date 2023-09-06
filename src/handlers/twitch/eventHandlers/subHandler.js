import { usersDB, cache, streamDB } from "../../../config/initializers.js";
import { writeToLogFile } from "../../../utilities/logging.js"
import { addAlert } from "../../../handlers/alertHandler.js";


// Subscription events
export async function newSubscription(e) {
    try {
        const userName = e.userName;
        const userDisplayName = e.userDisplayName;
        const userId = e.userId;
        const tier = e.tier / 1000;
        const isGift = e.isGift;
        if (!isGift) {
            const userData = await e.getUser();
            const profileImage = userData.profilePictureUrl;
            const newSubData = {
                id: userId,
                display_name: userDisplayName,
                login: userName,
                profile_image_url: profileImage,
            };
            // Stream database operations
            await streamDB.setLatestEvent('latest_sub', newSubData);
            await streamDB.increaseStreamProperty('total_points', amount);
            await streamDB.addNewSub(userDisplayName);

            // User database operations
            await usersDB.increaseUserValue(userId, 'leaderboard_points', (5000*tier));

            // Cache operations
            cache.set('streamSubs', cache.get('streamSubs') + 1);
            cache.set('monthlySubs', cache.get('monthlySubs') + 1);
            addAlert('sub', `${userDisplayName} subscribed at tier ${tier}!`, profileImage);
            writeToLogFile('info', `User ${userDisplayName} subscribed at tier ${tier}`);
        }
    }
    catch (error) {
        writeToLogFile('error', `Error in newSubscription: ${error}`);
    }
}