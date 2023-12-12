import logger from '../../utilities/logger.js';
import { twitchApi, chatClient, cache } from '../../config/initializers.js';


// Function to create a clip
export async function createClip() {
    try {
        const live = await cache.get('live');
        if (!live) {
            chatClient.say('Stream is not live, cannot create clip.');
        } else {
            console.log('Creating clip...');
            const clip = await twitchApi.createTwitchClip();
            const clipData = await twitchApi.getTwitchClipById(clip);
            const clipUrl = clipData.url;
            if (clipUrl) {
                chatClient.say(`Clip created: ${clipUrl}`);
            }
        }
    }
    catch (err) {
        console.log(`Error in createClip handler: ${err}`);
        logger.error(`Error in createClip handler: ${err}`);
    }
}