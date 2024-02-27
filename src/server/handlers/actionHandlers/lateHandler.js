import logger from '../../utilities/logger.js';
import { cache, chatClient, gameService } from '../../config/initializers.js';


let lateUsers = cache.get('lateUsers') || [];

export async function lateHandler(userId, displayName) {
    try {
        const late = cache.get('late');
        if (late) {
            // See if user is already in the late list
            const user = lateUsers.find(u => u.userId === userId);
            if (user) {
                return;
            } else {
                lateUsers.push({ userId, displayName });
                cache.set('lateUsers', lateUsers);
                chatClient.say(`Yes @dadthegam3r was late this stream... Again.`);
                gameService.rewardLateUser(userId);
            }
        }
    }
    catch (error) {
        logger.error(`Error in lateHandler: ${error}`);
    }
}