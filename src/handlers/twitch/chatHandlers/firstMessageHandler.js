
import { writeToLogFile } from "../../../utilities/logging.js";
import { cache, usersDB } from "../../../config/initializers";

// First message handler
export async function firstMessageHandler(context) {
    try {
        const streamData = await getStream();
        if (streamData.viewers.length > 3) {
            addViewerToCache(context.user)
            return;
        }
        const { bot, userId, msg, userDisplayName } = context;
        if (!cache.get('first').includes(userDisplayName)) {
            cache.set('first', [...cache.get('first'), userDisplayName]);
            if (cache.get('first').length === 1) {
                bot.reply('dadthegam3r', `@${userDisplayName} First message! You won 10,000 leaderboard points!`, msg.id);
                await usersDB.increaseUserValue(userId, 'leaderboard_points', 10000);
            } else if (cache.get('first').length === 2) {
                bot.reply('dadthegam3r', `@${userDisplayName} Second message! You won 5,000 leaderboard points!`, msg.id);
                await usersDB.increaseUserValue(userId, 'leaderboard_points', 5000);
            } else if (cache.get('first').length === 3) {
                bot.reply('dadthegam3r', `@${userDisplayName} Third message! You won 2,500 leaderboard points!`, msg.id);
                await usersDB.increaseUserValue(userId, 'leaderboard_points', 2500);
            }
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in firstMessageHandler: ${err}`)
    }
}