import logger from "../../utilities/logger.js";

// Get the lumiastream key from the environment variables
const apiKey = process.env.LUMIA_STREAM_KEY;
const url = process.env.STREAMING_PC_IP;

export async function getLumiaStreamSettings() {
    try {
        const response = await fetch(`http://${url}:39231/api/retrieve?token=${apiKey}`, {
            method: 'GET',
        });
        const data = await response.json();
        console.log(data.data.options['chat-command']);
        return data;
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in getLumiaStreamSettings: ${err}`);
    }
}