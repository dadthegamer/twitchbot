import NodeCache from 'node-cache';
import logger from '../utilities/logger.js';
import { chatClient, usersDB, leaderboardDB } from '../config/initializers.js';
import { actionEvalulate } from '../handlers/evaluator.js';
import { formatTimeFromMilliseconds } from '../utilities/utils.js';


// Command Class
class CommandService {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.cache = new NodeCache();
        this.userCooldownCache = new NodeCache({ stdTTL: 0, checkperiod: 300 });
        this.globalCooldownCache = new NodeCache({ stdTTL: 0, checkperiod: 300 });
        this.listenForExpiredKeys();
        this.setInitialCacheValues();
        this.createInitialCommands();
    }

    // Method to get all the commands from the database and add them to the cache
    async setInitialCacheValues() {
        try {
            const commands = await this.getAllCommandsFromDB();
            commands.forEach(command => {
                this.cache.set(command.name, command)
            });
        }
        catch (err) {
            logger.error(`Error in setInitialCacheValues: ${err}`);
        }
    }

    // Create initial commands
    async createInitialCommands() {
        try {
            this.createCommand('spin', [{ type: 'spin' }], 'Run the spin', 'everyone', true, 0, 0, false);
            this.createCommand('followage', [{ type: 'chat', response: '$followage' }], 'Flex your follow age to the chat', 'everyone', true, 0, 0, false);
            this.createCommand('watchtime', [{ type: 'chat', response: '$watchTime' }], 'Flex your watch time in chat', 'everyone', true, 0, 0, false);
            this.createCommand('viewtime', [{ type: 'chat', response: '$viewTime' }], 'Flex your view time to the chat', 'everyone', true, 0, 0, false);
            this.createCommand('uptime', [{ type: 'chat', response: '$uptime' }], 'Shows how long the stream has been live', 'everyone', true, 0, 0, false);
            this.createCommand('quote', [{ type: 'chat', response: '$quote' }], 'Get a quote from the database. Example !quote gets a random quote and !quote69 gets the 69th quote.', 'everyone', true, 0, 0, false);
            this.createCommand('clip', [{ type: 'clip' }], 'Create a clip', 'everyone', true, 0, 0, false);
            this.createCommand('queue', [{ type: 'queue', action: 'get' }], 'Get the current queue', true, 0, 0, false);
            this.createCommand('words', [{ type: 'chat', response: 'Dad knows all the best words and always says everyone’s name correctly' }], 'Get the current queue', true, 0, 0, false);
        }
        catch (err) {
            logger.error(`Error in createInitialCommands: ${err}`);
        }
    }

    // Method to listen for expired keys
    listenForExpiredKeys() {
        this.cache.on('expired', (key, value) => {
            this.removeCommand(key);
        });
    }


    // Method to get all commands from the database
    async getAllCommandsFromDB() {
        try {
            const commandsCollection = this.dbConnection.collection('commands');
            const result = await commandsCollection.find({}).toArray();
            return result;
        }
        catch (err) {
            logger.error(`Error in getAllCommandsFromDB: ${err}`);
        }
    }

    // Method to get all commands from the cache
    async getAllCommandsFromCache() {
        try {
            // Return all the commands from the cache into an array
            const commands = [];
            this.cache.keys().forEach(key => {
                commands.push(this.cache.get(key));
            });
            return commands;
        }
        catch (err) {
            logger.error(`Error in getAllCommandsFromCache: ${err}`);
        }
    }

    // Method to get a command from the database
    async getCommand(command) {
        try {
            // Check if the command is in the cache if it is return it and if it is not get it from the database and add it to the cache
            if (this.cache.has(command)) {
                return this.cache.get(command);
            } else {
                const commandsCollection = this.dbConnection.collection('commands');
                const result = await commandsCollection.findOne({ name: command });
                this.cache.set(command, result);
                return result;
            }
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

    // Method to remove a user from the user cooldown cache
    async removeUserFromCooldownCache(userId, commandName) {
        try {
            const key = `${userId}-${commandName}`;
            this.userCooldownCache.del(key);
        }
        catch (err) {
            logger.error(`Error in removeUserFromCooldownCache: ${err}`);
        }
    }

    // Method to add a command to the database
    async createCommand(commandName, commandHandlers, commandDescription, commandPermissions, commandEnabled = true, userCooldown = 0, globalCooldown = 0, liveOnly = false) {
        try {
            if (typeof commandHandlers === 'string') {
                commandHandlers = [commandHandlers];
            }
            if (typeof globalCooldown === 'string') {
                globalCooldown = parseInt(globalCooldown);
            }
            if (commandName.startsWith('!')) {
                commandName = commandName.slice(1);
            }
            if (typeof userCooldown === 'string') {
                userCooldown = parseInt(userCooldown);
            }
            if (await this.getCommand(commandName) !== null) {
                return;
            } else {
                const commandsCollection = this.dbConnection.collection('commands');
                const command = {
                    name: commandName,
                    handlers: commandHandlers,
                    description: commandDescription,
                    permissions: commandPermissions,
                    enabled: commandEnabled,
                    created: new Date(),
                    userCooldown: userCooldown,
                    globalCooldown: globalCooldown,
                    enabled: true,
                    liveOnly: liveOnly,
                };
                this.cache.set(commandName, command);
                const result = await commandsCollection.insertOne(command);
                logger.info(`Command created: ${result.name}`);
                return result;
            }
        } catch (error) {
            logger.error(`Error in createCommand: ${error}`);
        }
    }

    // Method to update a command in the database
    async updateCommand(commandName, commandHandlers, commandDescription, commandPermissions, commandEnabled, userCooldown, globalCooldown, liveOnly) {
        try {
            if (typeof commandHandlers === 'string') {
                commandHandlers = [commandHandlers];
            }
            if (typeof globalCooldown === 'string') {
                globalCooldown = parseInt(globalCooldown);
            }
            if (typeof userCooldown === 'string') {
                userCooldown = parseInt(userCooldown);
            }
            const commandsCollection = this.dbConnection.collection('commands');
            const result = await commandsCollection.updateOne({ name: commandName }, {
                $set: {
                    handlers: commandHandlers,
                    description: commandDescription,
                    permissions: commandPermissions,
                    enabled: commandEnabled,
                    userCooldown: userCooldown,
                    globalCooldown: globalCooldown,
                    liveOnly: liveOnly,
                }
            });
            this.cache.set(commandName, result);
            logger.info(`Command updated: ${result.name}`);
            return result;
        } catch (error) {
            logger.error(`Error in updateCommand: ${error}`);
        }
    }

    // Method to delete a command from the database by name
    async deleteCommand(commandName) {
        try {
            const commandsCollection = this.dbConnection.collection('commands');
            const result = await commandsCollection.deleteOne({ name: commandName });
            this.cache.del(commandName);
            logger.info(`Command deleted: ${commandName}`);
            return result;
        } catch (error) {
            logger.error(`Error in deleteCommand: ${error}`);
        }
    }

    // Method to toggle a command
    async toggleCommand(commandName, commandStatus) {
        try {
            const commandsCollection = this.dbConnection.collection('commands');
            const result = await commandsCollection.updateOne({ name: commandName }, {
                $set: {
                    enabled: commandStatus,
                }
            });
            this.cache.set(commandName, result);
            logger.info(`Command toggled: ${result.name}`);
            return result;
        } catch (error) {
            logger.error(`Error in toggleCommand: ${error}`);
            return false;
        }
    }

    // Handler
    async commandHandler(command, user, message, msg) {
        try {
            const prefix = '!';
            const { isFirst, isHighlighted, userInfo, id, isReply, isCheer } = msg;
            const { userId, displayName, color, isVip, isSubscriber, isMod, isBroadcaster } = userInfo;
            const commandName = command.slice(prefix.length);
            const commandNameTrimmed = commandName.replace(/[0-9]/g, '');
            const commandData = await this.getCommand(commandNameTrimmed);
            if (commandData) {
                const { handlers, permissions, enabled, userCooldown, globalCooldown, liveOnly } = commandData;
                if (enabled === false) {
                    return;
                }
                if (liveOnly && !cache.get('live')) {
                    return;
                }
                leaderboardDB.increaseCommandsUsedForUser(userId)
                const userCooldownStatus = await this.userCooldownHandler(userId, commandName, userCooldown);
                const globalCooldownStatus = await this.globalCooldownHandler(commandName, globalCooldown);
                if (permissions.includes('everyone' || permissions === 'everyone')) {
                    if (userCooldownStatus === true && globalCooldownStatus === true) {
                        for (const handler of handlers) {
                            await actionEvalulate(handler, { displayName, userId, messageID: id, input: message, isMod, isVip, isSubscriber, isBroadcaster, color });
                        }
                    } else if (userCooldownStatus !== true) {
                        // Calculate time left in seconds
                        const timeLeft = await formatTimeFromMilliseconds(userCooldownStatus - Date.now());
                        chatClient.replyToMessage(`You are on cooldown for this command. ${timeLeft} seconds left`, id);
                        return;
                    } else if (globalCooldownStatus !== true) {
                        const timeLeft = await formatTimeFromMilliseconds(globalCooldownStatus - Date.now());
                        chatClient.replyToMessage(`This command is on global cooldown. ${timeLeft} seconds left`, id);
                        return;
                    }
                } else if (permissions.includes('vip' || permissions === 'vip') && isVip) {
                    if (userCooldownStatus === true && globalCooldownStatus === true) {
                        for (const handler of handlers) {
                            await actionEvalulate(handler, { displayName, userId, messageID: id, input: message, isMod, isVip, isSubscriber, isBroadcaster });
                        }
                    } else if (userCooldownStatus !== true) {
                        // Calculate time left in seconds
                        const timeLeft = await formatTimeFromMilliseconds(userCooldownStatus - Date.now());
                        chatClient.replyToMessage(`You are on cooldown for this command. ${timeLeft} seconds left`, id);
                        return;
                    } else if (globalCooldownStatus !== true) {
                        const timeLeft = await formatTimeFromMilliseconds(globalCooldownStatus - Date.now());
                        chatClient.replyToMessage(`This command is on global cooldown. ${timeLeft} seconds left`, id);
                        return;
                    }
                } else if (permissions.includes('subscriber' || permissions === 'subscriber') && isSubscriber) {
                    if (userCooldownStatus === true && globalCooldownStatus === true) {
                        for (const handler of handlers) {
                            await actionEvalulate(handler, { displayName, userId, messageID: id, input: message, isMod, isVip, isSubscriber, isBroadcaster });
                        }
                    } else if (userCooldownStatus !== true) {
                        // Calculate time left in seconds
                        const timeLeft = await formatTimeFromMilliseconds(userCooldownStatus - Date.now());
                        chatClient.replyToMessage(`You are on cooldown for this command. ${timeLeft} seconds left`, id);
                        return;
                    } else if (globalCooldownStatus !== true) {
                        const timeLeft = await formatTimeFromMilliseconds(globalCooldownStatus - Date.now());
                        chatClient.replyToMessage(`This command is on global cooldown. ${timeLeft} seconds left`, id);
                        return;
                    }
                } else if (permissions.includes('mod' || permissions === 'mod') && isMod || isBroadcaster) {
                    if (userCooldownStatus === true && globalCooldownStatus === true) {
                        for (const handler of handlers) {
                            await actionEvalulate(handler, { displayName, userId, messageID: id, input: message, isMod, isVip, isSubscriber, isBroadcaster });
                        }
                    } else if (userCooldownStatus !== true) {
                        // Calculate time left in seconds
                        const timeLeft = await formatTimeFromMilliseconds(userCooldownStatus - Date.now());
                        chatClient.replyToMessage(`You are on cooldown for this command. ${timeLeft} seconds left`, id);
                        return;
                    } else if (globalCooldownStatus !== true) {
                        const timeLeft = await formatTimeFromMilliseconds(globalCooldownStatus - Date.now());
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

    // Method to flush the cache and reload all commands from the database
    async reloadCommands() {
        try {
            this.cache.flushAll();
            this.setInitialCacheValues();
        }
        catch (err) {
            logger.error(`Error in reloadCommands: ${err}`);
        }
    }
}

export default CommandService;