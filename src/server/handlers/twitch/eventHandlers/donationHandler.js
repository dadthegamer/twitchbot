import { streamDB, currencyDB, twitchApi } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";



export async function onDonation(data) {
    try {
        if (data.isMock) {
            console.log(data);
            return;
        }
        const { username, amount, providerId } = data.data;
        const userData = await twitchApi.getUserDataById(providerId);
        if (userData) {
            const { displayName, profilePictureUrl } = userData;
            await addAlert(providerId, displayName, 'donation', `${displayName} donated $${amount}`);
            const newDonationData = {
                id: userId,
                displayName: displayName,
                profilePictureUrl: profilePictureUrl,
                amount: amount,
            };
            await streamDB.setLatestEvent('latestDonation', newDonationData);
        } else {
            // Make the username all caps
            const userDisplayName = username.toUpperCase();
            await addAlert(providerId, username, 'donation', `${userDisplayName} donated $${amount}`);
            const newDonationData = {
                id: userId,
                displayName: userDisplayName,
                profilePictureUrl: null,
                amount: amount,
            };
            await streamDB.setLatestEvent('latestDonation', newDonationData);
        }
        currencyDB.addCurrencyForDonations(providerId, amount);
    }
    catch (error) {
        logger.error(`Error in onDonation: ${error}`);
    }
}