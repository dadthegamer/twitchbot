import { usersDB, goalDB, interactionsDB } from "../../../config/initializers.js";
import { ttsHandler } from "../../actionHandlers.js/ttsHandler.js";
import logger from "../../../utilities/logger.js";;

export async function onRedemptionAdd(e) {
    try {
        const { rewardTitle, rewardCost, userName, userDisplayName, userId, input, id, status } = e;
        switch (rewardTitle) {
            case 'Custom Shoutout':
                usersDB.setUserValue(userId, 'shoutout', input);
                break;
            case 'Text-to-Speech':
                const { profilePictureUrl } = await e.getUser();
                ttsHandler(input, profilePictureUrl);
                break;
            case 'Add A Quote':
                interactionsDB.createQuote(input, userDisplayName);
                break;
            case 'Dadb0t Roast':
                const roast = await interactionsDB.getRandomRoast();
                newTTS({
                    img: 'https://static-cdn.jtvnw.net/jtv_user_pictures/b203b527-659f-4e03-9733-3a5eb360d945-profile_image-300x300.png',
                    message: roast
                });
                break;
        }  
    }
    catch (error) {
        logger.error('error', `Error in onRedemptionAdd: ${error}`);
    }
}