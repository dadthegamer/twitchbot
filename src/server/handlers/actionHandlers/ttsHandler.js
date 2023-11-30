import { webSocket } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";
import { variableHandler } from '../variablesHandler.js';


export async function ttsHandler(message, userImg = 'https://static-cdn.jtvnw.net/jtv_user_pictures/b203b527-659f-4e03-9733-3a5eb360d945-profile_image-300x300.png') {
    try {
        if (message.includes('$')) {
            const newMessage = await variableHandler(message);
            webSocket.TTS({
                message: newMessage,
                img: userImg,
            });
        } else {
            webSocket.TTS({
                message: message,
                img: userImg,
            });
        }
    } catch (err) {
        logger.error(`Error in ttsHandler: ${err}`);
    }
}