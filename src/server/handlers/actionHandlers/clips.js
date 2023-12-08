import logger from '../../utilities/logger.js';
import { twitchApi, chatClient, cache } from '../../config/initializers.js';

// Function to create a clip
export async function createClip() {
    try {
        const live = await cache.get('live');
        if (!live) {
            chatClient.say('Stream is not live, cannot create clip.');
        } else {
            const clip = await twitchApi.createClip();
            setTimeout(async () => {
                if (clip !== null) {
                    const clipData = await twitchApi.getClipById(clip);
                    const clipUrl = clipData.url;
                    if (clipUrl) {
                        chatClient.say(`Clip created: ${clipUrl}`);
                    }
                } else {
                    logger.error(`Error creating clip: ${clip}`);
                }
            }, 1500);
        }
    }
    catch (err) {
        logger.error(`Error in createClip handler: ${err}`);
    }
}