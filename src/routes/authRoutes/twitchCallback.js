import { Router } from 'express';
import { exchangeCode } from '@twurple/auth';
import { twitchApi, twitchApiClient, usersDB, tokenDB } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        console.log(req.query)
        const code = req.query.code;
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        const redirectUri = process.env.TWITCH_REDIRECT_URI;
        const tokenData = await exchangeCode(clientId, clientSecret, code, redirectUri);
        const userData = await twitchApi.getUserDataByToken(tokenData.accessToken);
        if (!req.session.userData) {
            req.session.userData = userData;
        }
        if (userData.id === '64431397') {
            await tokenDB.storeUserAuthToken(userData.id, tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
            await twitchApiClient.addUserToAuthProvider(userData.id);
        } else if (userData.id === '671284746') {
            await tokenDB.storeUserAuthToken(userData.id, tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
            await twitchApiClient.addUserToAuthProvider(userData.id);
        }
        res.redirect('http://localhost:3000/');
    }
    catch (error) {
        console.error(error);
        res.redirect('http://localhost:3000/');
    }
});

export default router;