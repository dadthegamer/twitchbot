// Gift subscription events
export async function onGiftSubscription(e) {
    try {
        const user = e.gifterDisplayName;
        const tier = e.tier;
        const id = e.gifterId;
        const amount = e.amount;
        const userData = await e.getGifter();
        const profileImage = userData.profilePictureUrl;
        writeToLogFile('info', `User ${user} gifted ${amount} subscription at tier ${tier}`);
        setVariable('currentSubs', getVariable('currentSubs') + amount);
        await addAlert('giftedsub', `${user} gifted ${amount} subscription(s) at tier ${tier}!`, profileImage);
        await addSubs(id, amount, tier);
        onSubHandler(amount)
        increaseStreamProperty('giftedSubs', amount);
    }
    catch (error) {
        writeToLogFile('error', `Error in onGiftSubscription: ${error}`);
    }
}