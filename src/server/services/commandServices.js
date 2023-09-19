import NodeCache from 'node-cache';
import logger from '../utilities/logger.js';


// Command Class
class Commands {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.cache = new NodeCache();
        this.listenForExpiredKeys();
        this.setInitialCacheValues();
        this.createCommand('spin', [{type: 'spin'}], 'Displays a list of all the commands', 'everyone', true, 0, 0, false);
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

    // Method to listen for expired keys
    listenForExpiredKeys() {
        this.cache.on('expired', (key, value) => {
            console.log(`${key} expired`);
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

    // Method to add a command to the database
    async createCommand(commandName, commandHandlers, commandDescription, commandPermissions, commandEnabled, userCooldown, globalCooldown, liveOnly) {
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
            if (await this.getCommand(commandName) !== null) {
                console.log('Command already exists');
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
            console.log(error);
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

    // Method to delete a command from the database
    async deleteCommand(commandName) {
        try {
            const commandsCollection = this.dbConnection.collection('commands');
            const result = await commandsCollection.deleteOne({ name: commandName });
            this.cache.del(commandName);
            logger.info(`Command deleted: ${result.name}`);
            return true;
        } catch (error) {
            logger.error(`Error in deleteCommand: ${error}`);
            return false;
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

export default Commands;