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
        console.log(newFollowerData);
    }
    catch (error) {
        console.log(error);
    }
}