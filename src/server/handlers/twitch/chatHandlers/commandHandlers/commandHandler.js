import NodeCache from 'node-cache';
import { writeToLogFile } from '../../../../utilities/logging.js';
import { cache } from '../../../../config/initializers.js';
import { formatTimeFromMilliseconds } from '../../../../utilities/utils.js';
import { evalulate } from '../../../evaluater.js';
import { chatClient } from '../../../../config/initializers.js';

// Class to handle commands
class CommandHandler {
    constructor(commandsCache) {
        this.cache = commandsCache;
        this.userCooldownCache = new NodeCache({ stdTTL: 0, checkperiod: 300 });
        this.globalCooldownCache = new NodeCache({ stdTTL: 0, checkperiod: 300 });
    }

    // Method to get a command from the cache
    getCommand(command) {
        try {
            return this.cache.get(command);
        }
        catch (err) {
            writeToLogFile('error', `Error in getCommand: ${err}`)
            console.error('Error in getCommand:', err);
        }
    }

    // User cooldown handler
    async userCooldownHandler(userId, commandName, userCooldown) {
        if (userCooldown === 0) {
            return true;
        }
        try {
            const key = `${userId}-${commandName}`;
            if (this.userCooldownCache.has(key)) {
                return this.userCooldownCache.getTtl(key);
            } else {
                this.userCooldownCache.set(key, true, userCooldown);
                return true;
            }
        }
        catch (err) {
            writeToLogFile('error', `Error in commandCooldownHandler: ${err}`)
        }
    }

    // Global cooldown handler
    async globalCooldownHandler(commandName, globalCooldown) {
        if (globalCooldown === 0) {
            return true;
        }
        try {
            if (this.globalCooldownCache.has(commandName)) {
                return this.globalCooldownCache.getTtl(commandName);
            } else {
                this.globalCooldownCache.set(commandName, true, globalCooldown);
                return true;
            }
        }
        catch (err) {
            writeToLogFile('error', `Error in commandCooldownHandler: ${err}`)
        }
    }

    // Handler
    async commandHandler(command, parts, channel, user, message, msg, bot) {
        console.log('commandHandler');
        try {
            const prefix = '!';
            const { isFirst, isHighlighted, userInfo, id, isReply, isCheer } = msg;
            const { userId, displayName, color, isVip, isSubscriber, isMod } = userInfo;
            const commandName = command.slice(prefix.length);
            const commandData = await this.getCommand(commandName);
            if (commandData) {
                const { handlers, permissions, enabled, userCooldown, globalCooldown, liveOnly } = commandData;
                if (!liveOnly === false && cache.get('live') === false) {
                    return;
                }
                if (enabled === false) {
                    return;
                }
                const userCooldownStatus = await this.userCooldownHandler(userId, commandName, userCooldown);
                const globalCooldownStatus = await this.globalCooldownHandler(commandName, globalCooldown);
                if (permissions === 'everyone') {
                    if (userCooldownStatus === true && globalCooldownStatus === true) {
                        for (const handler of handlers) {
                            await evalulate(handler, { bot, msg, userDisplayName: displayName, userId, messageID: id });
                        }
                    } else if (userCooldownStatus !== true) {
                        // Calculate time left in seconds
                        const timeLeft = formatTimeFromMilliseconds(userCooldownStatus - Date.now());
                        chatClient.replyToMessage(`You are on cooldown for this command. ${timeLeft} seconds left`, id);
                        return;
                    } else if (globalCooldownStatus !== true) {
                        const timeLeft = formatTimeFromMilliseconds(globalCooldownStatus - Date.now());
                        console.log(`Global cooldown: ${timeLeft} seconds left`);
                        return;
                    }
                }
            } else {
                return;
            }
        }
        catch (err) {
            writeToLogFile('error', `Error in commandHandler: ${err}`)
            console.error('Error in commandHandler:', err);
        }
    }
}

export default CommandHandler;