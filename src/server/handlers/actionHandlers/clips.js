import logger from '../../utilities/logger.js';
import { twitchApi, chatClient, cache } from '../../config/initializers.js';


// Function to create a clip
export async function createClip() {
    try {
        const live = await cache.get('live');
        if (!live) {
            chatClient.say('Stream is not live, cannot create clip.');
        } else {
            const clip = await twitchApi.createTwitchClip();
            let tries = 0;
            let maxTries = 15;
            const interval = setInterval(async () => {
                const clipData = await twitchApi.getTwitchClipById(clip);
                if (clipData && clipData.url) {
                    chatClient.say(`Clip created: ${clipData.url}`);
                    clearInterval(interval);
                } else if (tries < maxTries) {
                    tries++;
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                } else {
                    logger.error(`Error in createClip handler: ${err}`);
                };
            }, 1000);
        }
    }
    catch (err) {
        logger.error(`Error in createClip handler: ${err}`);
    }
}