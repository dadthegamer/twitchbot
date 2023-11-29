import logger from "../../../utilities/logger.js";;
import { addAlert } from "../../../handlers/alertHandler.js";

export async function onRedemptionAdd(e) {
    try {
        const { rewardTitle, rewardCost, userName, userDisplayName, userId, input, id, status } = await e;
        const userData = await e.getUser();
        const { profilePictureUrl } = userData;
        logger.info('info', `Redemption: ${rewardTitle} | ${rewardCost} | ${userName} | ${userDisplayName} | ${userId} | ${input} | ${id} | ${status}`);
        console.log(`Redemption: ${rewardTitle} | ${rewardCost} | ${userName} | ${userDisplayName} | ${userId} | ${input} | ${id} | ${status}`)
        addAlert(userId, userDisplayName, 'follow', `${userDisplayName} redeemed`, profilePictureUrl);
    }
    catch (error) {
        console.log(`Error in onRedemptionAdd: ${error}`);
        logger.error('error', `Error in onRedemptionAdd: ${error}`);
    }
}