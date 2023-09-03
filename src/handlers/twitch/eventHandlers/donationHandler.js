async function onDonation(data) {
    try {
        const { username, amount } = data.data;
        const userData = await getUserDataByName(username);
        const { id } = userData;
        await setLatestEvent('latest_donation', userData);
        await addDonation(id, amount);
    }
    catch (error) {
        writeToLogFile('error', `Error in onDonation: ${error}`);
    }
}