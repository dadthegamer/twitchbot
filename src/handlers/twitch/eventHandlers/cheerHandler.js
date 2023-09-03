export async function onBits(e) {
    try {
        const userName = e.userName;
        const userDisplayName = e.userDisplayName;
        const userId = e.userId;
        const bits = e.bits;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        const newCheerData = {
            id: userId,
            display_name: userDisplayName,
            login: userName,
            profile_image_url: profileImage,
        };
        await setLatestEvent('latest_cheer', newCheerData);
        await addAlert('cheer', `${userDisplayName} cheered ${bits} bits!`, profileImage);
        await addBits(userId, userDisplayName, bits);
        await increaseStreamProperty('bits', bits);
    }
    catch (error) {
        writeToLogFile('error', `Error in onBits: ${error}`);
    }
}