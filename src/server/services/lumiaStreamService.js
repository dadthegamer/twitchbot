import logger from "../utilities/logger.js";
import { cache } from "../config/initializers.js";
import axios from 'axios';

// Get the lumiastream key from the environment variables
const apiKey = process.env.LUMIA_STREAM_KEY;
const url = process.env.STREAMING_PC_IP;

export async function getLumiaStreamSCommands() {
    try {
        const response = await axios.get(`http://${url}:39231/api/retrieve?token=${apiKey}`, {
            method: 'GET',
        });
        const data = response.data.data
        const chatCommands = data.options['chat-command'].values;
        return cache.set('lumiaStreamCommands', chatCommands);
    }
    catch (err) {
        const message = err.message;
        // If the error message has 'ETIMEDOUT' in it, the server is offline
        if (message.includes('ETIMEDOUT')) {
            logger.error(`Error in getLumiaStreamSettings: ${err}`);
        } else {
            logger.error(`Error in getLumiaStreamSettings: ${err}`);
        }
    }
}

// Get the commands from the cache. If they don't exist, get them from the api
export async function getLumiaStreamCommands() {
    try {
        const commands = cache.get('lumiaStreamCommands');
        if (commands) {
            return commands;
        } else {
            await getLumiaStreamSCommands();
            return cache.get('lumiaStreamCommands');
        }
    }
    catch (err) {
        logger.error(`Error in getLumiaStreamCommands: ${err}`);
    }
}

export async function sendCommand(command) {
    // Make sure the command being sent is a command in the lumiaStreamCommands cache
    const commands = cache.get('lumiaStreamCommands');
    if (commands.includes(command)) {
        try {
            console.log(`Sending command: ${command}`);
            // Make a post request with the apiKey being sent as a parameter
            const response = await fetch(`http://${url}:39231/api/send?token=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "type": "chat-command",
                    "params": {
                        "value": `${command}`,
                    }
                }),
            });
        }
        catch (err) {
            logger.error(`Error in sendCommand: ${err}`);
        }
    }
    else {
        logger.error(`Error in sendCommand: ${command} is not a valid command`);
    }
}

export async function turnLightsOff() {
    try {
        // Make a post request with the apiKey being sent as a parameter
        const response = await axios.post(`http://${url}:39231/api/send?token=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "type": "lights-off",
                "params": {
                    "value": "off",
                }
            }),
        });
    }
    catch (err) {
        logger.error(`Error in turnLightsOff: ${err}`);
    }
}

export default getLumiaStreamSCommands;