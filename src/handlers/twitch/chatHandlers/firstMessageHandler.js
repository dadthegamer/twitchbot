
import { writeToLogFile } from "../../../utilities/logging.js";
import { cache, usersDB } from "../../../config/initializers.js";
import { chatClient } from "../../../config/initializers.js";

// First message handler
export async function firstMessageHandler(context) {
    try {
        const { bot, userId, message, msg, userDisplayName, id } = context;
        if (!cache.get('first').includes(userDisplayName)) {
            cache.set('first', [...cache.get('first'), userDisplayName]);
            if (cache.get('first').length === 1) {
                chatClient.replyToMessage(`@${userDisplayName} First message! You won 10,000 leaderboard points!`, id);
                await usersDB.increaseUserValue(userId, 'leaderboard_points', 10000);
            } else if (cache.get('first').length === 2) {
                chatClient.replyToMessage(`@${userDisplayName} Second message! You won 5,000 leaderboard points!`, id);
                await usersDB.increaseUserValue(userId, 'leaderboard_points', 5000);
            } else if (cache.get('first').length === 3) {
                chatClient.replyToMessage(`@${userDisplayName} Third message! You won 2,500 leaderboard points!`, id);
                await usersDB.increaseUserValue(userId, 'leaderboard_points', 2500);
            }
        }
    }
    catch (err) {
        console.log(`Error in firstMessageHandler: ${err}`)
        writeToLogFile('error', `Error in firstMessageHandler: ${err}`)
    }
}