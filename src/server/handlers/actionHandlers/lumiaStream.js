import logger from "../../utilities/logger.js";
import { cache } from '../../config/initializers.js';


// Get the lumiastream key from the environment variables
const apiKey = process.env.LUMIA_STREAM_KEY;
const url = process.env.STREAMING_PC_IP;

export async function getLumiaStreamSettings() {
    try {
        const response = await fetch(`http://${url}:39231/api/retrieve?token=${apiKey}`, {
            method: 'GET',
        });
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in getLumiaStreamSettings: ${err}`);
    }
}

// Function to get the chat commands from the lumia stream
export async function getChatCommands() {
    try {
        const response = await fetch(`http://${url}:39231/api/retrieve?token=${apiKey}`, {
            method: 'GET',
        });
        const data = await response.json();
        cache.set('lumiaStreamCommands', data.data.options['chat-command'].values);
        return data.data.options['chat-command'].values;
    }
    catch (err) {
        logger.error(`Error in getChatCommands: ${err}`);
    }
}

// Function to send a command to the lumia stream
export async function sendCommand(command) {
    try {
        // Check if the command is in the cache
        const commands = cache.get('lumiaStreamCommands');
        if (commands.includes(command) === false) {
            return;
        } else {
            const response = await fetch(`http://${url}:39231/api/send?token=${apiKey}`, {
                method: 'POST',
                body: JSON.stringify({
                    type: 'chat-command',
                    params: {
                        value: command
                    }
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return data;
        }
    }
    catch (err) {
        logger.error(`Error in sendCommand: ${err}`);
    }
}

// Function to send a color and brightness command to the lumia stream
export async function sendColorCommand(color) {
    try {
        const response = await fetch(`http://${url}:39231/api/send?token=${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                type: 'hex-color',
                params: {
                    value: color,
                    brightness: 100,
                    transition: 0,
                    duration: 5000
                }
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    }
    catch (err) {
        if (err.message.includes('TypeError: fetch failed')) {
            return;
        } else {
            logger.error(`Error in sendColorCommand: ${err}`);
        }
    }
}