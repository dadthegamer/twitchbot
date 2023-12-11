import logger from "../../../utilities/logger.js";;
import { channelPointService } from "../../../config/initializers.js";


export async function onRedemptionAdd(e) {
    try {
        const { rewardTitle, rewardCost, userName, userDisplayName, userId, input, id, status, rewardId } = await e;
        logger.info('info', `Redemption: ${rewardTitle} | ${rewardCost} | ${userName} | ${userDisplayName} | ${userId} | ${input} | ${id} | ${status}`);
        console.log(`Redemption: ${rewardTitle} | ${rewardCost} | ${userName} | ${userDisplayName} | ${userId} | ${input} | ${id} | ${status}`)
        channelPointService.rewardRedemptionHandler(rewardId, userId, userDisplayName, input);
    }
    catch (error) {
        console.log(`Error in onRedemptionAdd: ${error}`);
        logger.error('error', `Error in onRedemptionAdd: ${error}`);
    }
}