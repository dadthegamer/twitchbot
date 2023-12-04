
import { cache, currencyDB } from "../../../config/initializers.js";
import { chatClient } from "../../../config/initializers.js";
import logger from "../../utilities/logger.js";


// First message handler
export async function firstMessageHandler(context) {
    try {
        const { bot, userId, message, msg, userDisplayName, id } = context;
        if (!cache.get('first').includes(userDisplayName)) {
            cache.set('first', [...cache.get('first'), userDisplayName]);
            if (cache.get('first').length === 1) {
                chatClient.replyToMessage(`@${userDisplayName} First message! You were rewarded currency!`, id);
                await currencyDB.addCurrencyForFirst(userId, 1)
            } else if (cache.get('first').length === 2) {
                chatClient.replyToMessage(`@${userDisplayName} Second message! You were rewarded currency!`, id);
                await currencyDB.addCurrencyForFirst(userId, 2)
            } else if (cache.get('first').length === 3) {
                chatClient.replyToMessage(`@${userDisplayName} Third message! You were rewarded currency!`, id);
                await currencyDB.addCurrencyForFirst(userId, 3)
            }
        }
    }
    catch (err) {
        logger.error(`Error in firstMessageHandler: ${err}`);
    }
}