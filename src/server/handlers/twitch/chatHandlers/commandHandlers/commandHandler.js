import NodeCache from 'node-cache';
import { cache } from '../../../../config/initializers.js';
import { formatTimeFromMilliseconds } from '../../../../utilities/utils.js';
import { evalulate } from '../../../evaluater.js';
import { chatClient } from '../../../../config/initializers.js';
import logger from '../../../../utilities/logger.js';

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
            // Remove any numbers after the command. It will look like quote3, quote4, etc.
            const commandName = command.replace(/[0-9]/g, '');
            return this.cache.get(commandName);
        }
        catch (err) {
            logger.error(`Error in getCommand: ${err}`);
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
            logger.error(`Error in userCooldownHandler: ${err}`);
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
            logger.error(`Error in globalCooldownHandler: ${err}`);
        }
    }

    // Handler
    async commandHandler(command, parts, channel, user, message, msg, bot) {
        try {
            const prefix = '!';
            const { isFirst, isHighlighted, userInfo, id, isReply, isCheer } = msg;
            const { userId, displayName, color, isVip, isSubscriber, isMod } = userInfo;
            const commandName = command.slice(prefix.length);
            const commandData = await this.getCommand(commandName);
            if (commandData) {
                const { handlers, permissions, enabled, userCooldown, globalCooldown, liveOnly } = commandData;
                if (!liveOnly && cache.get('live')) {
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
                            await evalulate(handler, { bot, msg, userDisplayName: displayName, userId, messageID: id, parts, input: message, rewardId: null });
                        }
                    } else if (userCooldownStatus !== true) {
                        // Calculate time left in seconds
                        const timeLeft = formatTimeFromMilliseconds(userCooldownStatus - Date.now());
                        chatClient.replyToMessage(`You are on cooldown for this command. ${timeLeft} seconds left`, id);
                        return;
                    } else if (globalCooldownStatus !== true) {
                        const timeLeft = formatTimeFromMilliseconds(globalCooldownStatus - Date.now());
                        chatClient.replyToMessage(`This command is on global cooldown. ${timeLeft} seconds left`, id);
                        return;
                    }
                }
            } else {
                return;
            }
        }
        catch (err) {
            logger.error(`Error in commandHandler: ${err}`);
        }
    }
}

export default CommandHandler;