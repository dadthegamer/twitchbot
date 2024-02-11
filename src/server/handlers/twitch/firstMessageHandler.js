
import { cache, currencyDB, chatClient, usersDB } from "../../config/initializers.js";
import logger from "../../utilities/logger.js";


// First message handler
export async function firstMessageHandler(context) {
    try {
        const { userId, displayName, id } = context;
        if (cache.get('first') === undefined) {
            cache.set('first', []);
        };
        if (!cache.get('first').includes(displayName)) {
            cache.set('first', [...cache.get('first'), displayName]);
            if (cache.get('first').length === 1) {
                chatClient.replyToMessage(`@${displayName} First message!`, id);
                currencyDB.addCurrencyForFirst(userId, 1)
                usersDB.increaseFirstPlace(userId);
            } else if (cache.get('first').length === 2) {
                chatClient.replyToMessage(`@${displayName} Second message!`, id);
                currencyDB.addCurrencyForFirst(userId, 2)
                usersDB.increaseSecondPlace(userId);
            } else if (cache.get('first').length === 3) {
                chatClient.replyToMessage(`@${displayName} Third message!`, id);
                currencyDB.addCurrencyForFirst(userId, 3)
                usersDB.increaseThirdPlace(userId);
            }
        }
    }
    catch (err) {
        logger.error(`Error in firstMessageHandler: ${err}`);
    }
}