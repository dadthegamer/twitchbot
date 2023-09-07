import { Router } from 'express';
import { exchangeCode } from '@twurple/auth';
import { twitchApi, usersDB, tokenDB } from '../../config/initializers.js';
import axios from 'axios';

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
        writeToLogFile('error', `Error getting user data by token: ${error}`);
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
        await tokenDB.storeUserAuthToken(userData.id, tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
        if (!req.session.userData) {
            req.session.userData = userData;
        }
        // if (userData.id === '64431397') {
        //     await twitchApiClient.addUserToAuthProvider(userData.id);
        // } else if (userData.id === '671284746') {
        //     await twitchApiClient.addUserToAuthProvider(userData.id);
        // }
        res.redirect('http://localhost:3000/');
    }
    catch (error) {
        console.error(error);
        res.redirect('http://localhost:3000/');
    }
});

export default router;