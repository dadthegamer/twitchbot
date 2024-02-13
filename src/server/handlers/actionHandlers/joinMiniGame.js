import logger from '../../utilities/logger.js';
import { webSocket, twitchApi, cache } from "../../config/initializers.js";
import { chatMessageHandler } from './chatHandler.js';


export async function joinMiniGameHandler(userId, displayName, color) {
    try {
        // const minigGameStatus = cache.get('miniGame');
        // if (!minigGameStatus || minigGameStatus === undefined || minigGameStatus === null) {
        //     return;
        // }
        // Check if the user is already in the mini game
        let miniGameUsers = cache.get('miniGameUsers');
        if (!miniGameUsers || miniGameUsers === undefined) {
            miniGameUsers = [];
            cache.set('miniGameUsers', []);
        }
        const user = miniGameUsers.find(user => user.userId === userId);
        if (!user) {
            miniGameUsers.push({ userId, displayName });
            cache.set('miniGameUsers', miniGameUsers);
            const userData = await twitchApi.getUserDataById(userId);
            const profilePic = userData.profilePictureUrl;
            webSocket.miniGameUser(userId, displayName, color, profilePic);
            chatMessageHandler(`@${displayName} has joined the mini game!`);
        } else {
            return;
        }
    } catch (err) {
        logger.error(`Error in joinMiniGameHandler: ${err}`);
    }
}