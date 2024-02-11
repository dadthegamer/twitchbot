import logger from "../../../utilities/logger.js";
import { channelPointService, eventServices, usersDB } from "../../../config/initializers.js";


export async function onRedemptionAdd(e) {
    try {
        const { rewardTitle, rewardCost, userName, userDisplayName, userId, input, id, status, rewardId } = await e;
        channelPointService.rewardRedemptionHandler(rewardId, userId, userDisplayName, input);
        usersDB.increaseChannelPointRedemptions(userId);
        usersDB.increaseChannelPointsSpent(userId, rewardCost);
        eventServices.handleEvent('onRedemptionAdd', { userId, displayName: userDisplayName, input });
    }
    catch (error) {
        logger.error('error', `Error in onRedemptionAdd: ${error}`);
    }
}