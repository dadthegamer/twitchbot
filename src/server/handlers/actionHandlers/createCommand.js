import logger from '../../utilities/logger.js';
import { chatClient, commandHandler } from '../../config/initializers.js';


// Function for a mod to create a command
export async function createCommand(commandName, response) {
    try {
        await commandHandler.createCommand(commandName, [ { type: 'chat', response } ], 'Mod created command', ['everyone']);
        if (response) {
            chatClient.say(`Command !${commandName} created successfully!`);
        }
    }
    catch (err) {
        logger.error(`Error in createCommand handler: ${err}`);
    }
}