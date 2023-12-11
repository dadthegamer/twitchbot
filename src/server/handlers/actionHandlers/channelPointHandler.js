import logger from '../../utilities/logger.js';
import { twitchApi } from '../../config/initializers.js';


// Function to change the cost of a reward
export async function changeRewardCost(rewardId, cost) {
    try {
        await twitchApi.updateCustomReward(rewardId, { cost: cost })
    } catch (err) {
        logger.error(`Error in changeRewardCost handler: ${err}`);
    }
}

// Function to enable a reward
export async function enableReward(rewardId) {
    try {
        await twitchApi.updateCustomReward(rewardId, { isEnabled: true })
    } catch (err) {
        logger.error(`Error in enableReward handler: ${err}`);
    }
}

// Function to disable a reward
export async function disableReward(rewardId) {
    try {
        await twitchApi.updateCustomReward(rewardId, { isEnabled: false })
    } catch (err) {
        logger.error(`Error in disableReward handler: ${err}`);
    }
}