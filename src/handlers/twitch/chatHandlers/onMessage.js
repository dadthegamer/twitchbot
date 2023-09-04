import { cache } from "../../../config/initializers.js";
import { commandHandler } from "./commandHandlers/commandHandler.js";
import { writeToLogFile } from "../../../utilities/logging.js";
import { environment } from "../../../config/environmentVars.js";
import { firstMessageHandler } from "./firstMessageHandler.js";

// Message Handler
export async function onMessageHandler(channel, user, message, msg, bot) {
    try {
        const { isFirst, isHighlighted, userInfo, id, isReply, isCheer } = msg;
        const { userId, displayName, color, isVip, isSubscriber, isMod } = userInfo;
        const parts = message.split(' ');
        const prefix = '!';
        const command = parts[0];
        if (command.startsWith(prefix)) {
            // handleCommand(command, parts, channel, user, message, msg, bot);
            commandHandler(command, parts, channel, user, message, msg, bot);
        }
        if (environment === 'production') {
            if (knownBots.has(userId)) {
                return;
            }
            if (first.length < 3) {
                firstMessageHandler({ bot, msg, user, userDisplayName: displayName, userId, messageId: id });
            }
        }
        const date = new Date();
        if (activeUsers.has(userId)) {
            activeUsers.ttl(userId, 900);
        } else {
            activeUsers.set(userId, {
                displayName: displayName,
                username: user,
                color: color,
                userId: userId,
                lastSeen: date.getTime(),
            });
        }
        if (await userIsViewer(user) === false) {
            if (process.env.NODE_ENV === 'production') {
                await addViewer(user);
            }
            // Add the viewer to the viewers cache
            cache.set('viewers', [...viewers, user]);
            setWelcomeMessage(userId, displayName);
            if (!firstArrived) {
                if (await getHighestUserByProperty('leaderboard_points') === userId) {
                    const points = await getUserProperty(userId, 'leaderboard_points');
                    bot.announce('dadthegam3r', `@${displayName} has arrived and is the current leaderboard points leader! with ${numberWithCommas(points)} points!`);
                    firstArrived = true;
                }
            }
            if (isFirst) {
                console.log('First message');
            }
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in messageHandler: ${err}`)
        console.error('Error in messageHandler:', err);
    }
}