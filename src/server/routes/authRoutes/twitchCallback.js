import { Router } from 'express';
import { exchangeCode } from '@twurple/auth';
import { twitchApi, usersDB, tokenDB, authProvider } from '../../config/initializers.js';
import axios from 'axios';
import logger from '../../utilities/logger.js';
import { hostName, botId, streamerUserId } from '../../config/environmentVars.js';


const router = Router();


async function getUserDataByToken(token) {
    try {
        const response = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = response.data.data[0];
        return data;
    }
    catch (error) {
        console.log(error);
        logger.error(`Error in getUserDataByToken: ${error}`);
    }
}


router.get('/', async (req, res) => {
    try {
        const code = req.query.code;
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        const redirectUri = process.env.TWITCH_REDIRECT_URI;
        const tokenData = await exchangeCode(clientId, clientSecret, code, redirectUri);
        const userData = await getUserDataByToken(tokenData.accessToken);
        req.session.userData = userData;
        await usersDB.newUser(userData.id, userData.email);
        if (userData.id === streamerUserId || userData.id === botId) {
            tokenData.userId = userData.id;
            await tokenDB.storeUserAuthToken(userData.id, tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
            await authProvider.addUserToAuthProvider(tokenData);
        }
        res.redirect(`https://${hostName}/`);
    }
    catch (error) {
        logger.error(`Error in twitchCallback.js: ${error}`);
        res.redirect(`https://${hostName}/`);
    }
});

export default router;