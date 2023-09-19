import { cache, currencyDB } from "../../../config/initializers.js";

let currentLevel = 1;


// Hype Train events
export async function onHypeTrainBegin(e) {
    const { id, goal, topContributions, level, progress } = e;
    console.log('Hype train started');
    if (level > currentLevel) {
        currentLevel = level;
        await currencyDB.rewardAllViewersWithCurrencyForHypeTrainProgress();
    }
}

export async function onHypeTrainProgress(e) {
    const { id, goal, topContributions, level, progress } = e;
    cache.set('hypeTrain', e);
    if (level > currentLevel) {
        currentLevel = level;
        await currencyDB.rewardAllViewersWithCurrencyForHypeTrainProgress();
    }

}

export async function onHypeTrainEnd(e) {
    console.log('Hype train ended');
    cache.set('hypeTrain', e);
    currentLevel = 1;
}