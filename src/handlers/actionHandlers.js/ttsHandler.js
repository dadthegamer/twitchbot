import { writeToLogFile } from "../../utilities/logging.js";
import { webSocket } from "../../config/initializers.js";

export async function ttsHandler(message, userImg = 'https://static-cdn.jtvnw.net/jtv_user_pictures/b203b527-659f-4e03-9733-3a5eb360d945-profile_image-300x300.png') {
    try {
        webSocket.TTS( {
            message: message,
            img: userImg,
        });
        writeToLogFile('info', `Speech generated for message: ${message}`);
    } catch (err) {
        console.log('Error generating speech:', err);
        writeToLogFile('error', `Error generating speech: ${err}`);
    }
}