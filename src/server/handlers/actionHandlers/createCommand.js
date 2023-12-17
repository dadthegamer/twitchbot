import logger from '../../utilities/logger.js';
import { twitchApi, chatClient, cache, commandHandler } from '../../config/initializers.js';


// Function for a mod to create a command
export async function createCommand(command) {
    try {
        const response = await commandHandler.createCommand(command, [{ type: 'chat' }], 'Mod Created Command', ['everyone']);
        if (response) {
            chatClient.say(twitchApi.channels[0], `Command ${command} created successfully!`);
        }
    }
    catch (err) {
        logger.error(`Error in createCommand handler: ${err}`);
    }
}