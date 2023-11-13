import { channelPointsService } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";;


export async function onRedemptionAdd(e) {
    try {
        const { rewardTitle, rewardCost, userName, userDisplayName, userId, input, id, status } = e;
        await channelPointsService.handleRewardRedemption(id, userId, userDisplayName, input);
    }
    catch (error) {
        logger.error('error', `Error in onRedemptionAdd: ${error}`);
    }
}