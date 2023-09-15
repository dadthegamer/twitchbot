import { usersDB, streamDB } from "../../../config/initializers.js";
import { writeToLogFile } from "../../../utilities/logging.js"
import { addAlert } from "../../../handlers/alertHandler.js";

// Follow events handler
export async function onFollow(e) {
    try {
        const user = e.userDisplayName;
        const userId = e.userId;
        const userName = e.userName;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        const newFollowerData = {
            id: userId,
            display_name: user,
            login: userName,
            profile_image_url: profileImage,
        };
        await usersDB.newFollower(newFollowerData);
        await streamDB.setLatestEvent('latest_follower', newFollowerData);
        addAlert('follow', `${user} followed!`, profileImage);
        await streamDB.addFollower(user);
        writeToLogFile('info', `User ${user} followed`);
    }
    catch (error) {
        writeToLogFile('error', `Error in onFollow: ${error}`);
    }
}