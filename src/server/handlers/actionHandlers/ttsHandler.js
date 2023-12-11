import { webSocket, twitchApi } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";


export async function ttsHandler(message, userId, userImg = 'https://static-cdn.jtvnw.net/jtv_user_pictures/b203b527-659f-4e03-9733-3a5eb360d945-profile_image-300x300.png') {
    try {
        const userData = await twitchApi.getUserDataById(userId);
        if (userData) {
            userImg = userData.profilePictureUrl;
        }
        webSocket.TTS({
            message: message,
            img: userImg,
        });
    } catch (err) {
        logger.error(`Error in ttsHandler: ${err}`);
    }
}