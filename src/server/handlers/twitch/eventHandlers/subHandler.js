import { usersDB, cache, streamDB } from "../../../config/initializers.js";
import { writeToLogFile } from "../../../utilities/logging.js"
import { addAlert } from "../../../handlers/alertHandler.js";


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
        cache.set('streamSubs', cache.get('streamSubs') + 1);
        cache.set('monthlySubs', cache.get('monthlySubs') + 1);
        await usersDB.increaseUserValue(e.userId, 'leaderboard_points', 5000 * tier);
        await userData.setUserValue(e.userId, 'cumulative_months', cumulativeMonths);
        await userData.setUserValue(e.userId, 'duration_months', durationMonths);
        await userData.setUserValue(e.userId, 'streak_months', streakMonths);
        await addAlert('resub', `${userDisplayName} re-subscribed at tier ${tier}!`, profileImage);
        const latestSubsData = {
            id: userId,
            display_name: userDisplayName,
            login: userName,
            profile_image_url: profileImage,
        };
        await streamDB.setLatestEvent('latest_subscriber', latestSubsData);
        await streamDB.addNewSub(userDisplayName);
    }
    catch (error) {
        writeToLogFile('error', `Error in onSubscription: ${error}`);
    }
}