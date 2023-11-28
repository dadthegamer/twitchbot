import logger from "../../../utilities/logger.js";;


export async function onRedemptionAdd(e) {
    try {
        const { rewardTitle, rewardCost, userName, userDisplayName, userId, input, id, status } = e;
        logger.info('info', `Redemption: ${rewardTitle} | ${rewardCost} | ${userName} | ${userDisplayName} | ${userId} | ${input} | ${id} | ${status}`);
        console.log(`Redemption: ${rewardTitle} | ${rewardCost} | ${userName} | ${userDisplayName} | ${userId} | ${input} | ${id} | ${status}`)
    }
    catch (error) {
        logger.error('error', `Error in onRedemptionAdd: ${error}`);
    }
}