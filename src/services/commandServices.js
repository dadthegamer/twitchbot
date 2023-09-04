import { writeToLogFile } from '../utilities/logging.js';

// Command Class

export class CommandDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
    }

    // Method to return all commands
    async getAllCommands() {
        try {
            let commands = this.cache.get('commands');
            if (commands) {
                return commands;
            } else {
                commands = await this.dbConnection.collection('commands').find({}).toArray();
                this.cache.set('commands', commands);
                return commands;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error in getAllCommands: ${error}`);
            return null;
        }
    }

    // Method to return command data
    async getCommandByCommandName(commandName) {
        try {
            if (typeof commandName !== 'string') {
                commandName = commandName.toString();
            }
            let command = this.cache.get(commandName);
            if (command) {
                return command;
            } else {
                command = await this.dbConnection.collection('commands').findOne({ commandName: commandName });
                this.cache.set(commandName, command);
                return command;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error in getCommand: ${error}`);
            return null;
        }
    }

    // Method to add a command
    async addCommand(commandName, commandHandler, commandDescription, commandPermissions, commandEnabled, userCooldown, globalCooldown, liveOnly) {
        try {
            const date = new Date();
            const query = { commandName: commandName };
            const update = {
                $set: {
                    commandName: commandName,
                    commandHandler: commandHandler,
                    commandDescription: commandDescription,
                    commandPermissions: commandPermissions,
                    commandEnabled: commandEnabled,
                    userCooldown: userCooldown,
                    globalCooldown: globalCooldown,
                    liveOnly: liveOnly,
                    dateAdded: date,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('commands').updateOne(query, update, options);
            // Add the command to the cache
            this.cache.set(commandName, update);
            let commands = this.cache.get('commands');
            commands.push(update);
            this.cache.set('commands', commands);
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in addCommand: ${error}`);
            return false;
        }
    }

    // Method to remove a command
    async removeCommand(commandName) {
        try {
            const query = { commandName: commandName };
            await this.dbConnection.collection('commands').deleteOne(query);
            // Remove the command from the cache
            this.cache.del(commandName);
            let commands = this.cache.get('commands');
            commands = commands.filter(command => command.commandName !== commandName);
            this.cache.set('commands', commands);
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in removeCommand: ${error}`);
            return false;
        }
    }

    // Method to update a command
    async updateCommand(commandName, commandHandler, commandDescription, commandPermissions, commandEnabled, userCooldown, globalCooldown, liveOnly) {
        try {
            const date = new Date();
            const query = { commandName: commandName };
            const update = {
                $set: {
                    commandName: commandName,
                    commandHandler: commandHandler,
                    commandDescription: commandDescription,
                    commandPermissions: commandPermissions,
                    commandEnabled: commandEnabled,
                    userCooldown: userCooldown,
                    globalCooldown: globalCooldown,
                    liveOnly: liveOnly,
                    dateAdded: date,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('commands').updateOne(query, update, options);
            // Update the command in the cache
            this.cache.set(commandName, update);
            let commands = this.cache.get('commands');
            commands = commands.filter(command => command.commandName !== commandName);
            commands.push(update);
            this.cache.set('commands', commands);
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in updateCommand: ${error}`);
            return false;
        }
    }

    // Method to enable/disable a command
    async enableCommand(commandName, commandEnabled) {
        try {
            const query = { commandName: commandName };
            const update = { $set: { commandEnabled: commandEnabled } };
            await this.dbConnection.collection('commands').updateOne(query, update);
            // Update the command in the cache
            const command = this.cache.get(commandName);
            command.commandEnabled = commandEnabled;
            this.cache.set(commandName, command);
            let commands = this.cache.get('commands');
            commands = commands.filter(command => command.commandName !== commandName);
            commands.push(command);
            this.cache.set('commands', commands);
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in enableCommand: ${error}`);
            return false;
        }
    }
}