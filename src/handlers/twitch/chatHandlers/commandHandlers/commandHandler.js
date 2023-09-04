import { cache } from '../../../../config/initializers.js';
import { writeToLogFile } from '../../../../utilities/logging.js';


export async function commandCooldownHandler(userId, commandName, cooldown) {
    if (cooldown === 0) {
        return true;
    }
    try {
        const key = `${userId}-${commandName}`;
        const commandCooldown = await cache.get(key);
        if (commandCooldown) {
            return commandCooldown.getTtl(key);
        } else {
            cache.set(key, true, cooldown);
            return true;
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in commandCooldownHandler: ${err}`)
    }
}

export async function globalCooldownHandler(commandName, cooldown) {
    if (cooldown === 0) {
        return true;
    }
    try {
        const key = `${commandName}`;
        const commandCooldown = await cache.get(key);
        if (commandCooldown) {
            return commandCooldown.getTtl(key);
        } else {
            cache.set(key, true, cooldown);
            return true;
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in globalCooldownHandler: ${err}`)
    }
}

export async function commandHandler(command, parts, channel, user, message, msg, bot) {
    console.log(`Command: ${command}`)
    try {
        const prefix = '!';
        const { isFirst, isHighlighted, userInfo, id, isReply, isCheer } = msg;
        const { userId, displayName, color, isVip, isSubscriber, isMod } = userInfo;
        const commandName = command.slice(prefix.length);
        const commandData = await getCommandFromCache(commandName);
        if (commandData) {
            const { handlers, permissions, enabled, userCooldown, globalCooldown } = commandData;
            if (enabled) {
                const userCooldownStatus = await commandCooldownHandler(userId, commandName, userCooldown);
                const globalCooldownStatus = await globalCooldownHandler(commandName, globalCooldown);
                if (permissions === 'everyone') {
                    if (userCooldownStatus === true && globalCooldownStatus === true) {
                        for (const handler of handlers) {
                            await evalulate(handler, { bot, msg, userDisplayName: displayName, userId, say: bot.say, timeout: bot.timeout, reply: bot.reply });
                        }
                    } else if (globalCooldownStatus !== true) {
                        const timeLeft = formatTime(globalCooldownStatus - Date.now());
                        console.log(`Global cooldown: ${command} - ${timeLeft}`);
                    } else if (userCooldownStatus !== true) {
                        const timeLeft = formatTime(userCooldownStatus - Date.now());
                        console.log(`User cooldown: ${command} - ${timeLeft}`);
                    }
                }
            } else {
                console.log(`Command disabled: ${command}`);
            }
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in commandHandler: ${err}`);
    }
}