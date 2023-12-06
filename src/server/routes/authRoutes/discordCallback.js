import { Router } from 'express';
import { discordClientID, discordRedirectURI, discordClientSecret, hostName } from '../../config/environmentVars.js';
import logger from '../../utilities/logger.js';
import axios from 'axios';
import { usersDB } from '../../config/initializers.js';

const router = Router();

// Function to exchange code for access token
async function exchangeCode(code) {
    const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI
    };
    try {
        const response = await axios.post(`https://discord.com/api/oauth2/token`,
            data,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                auth: {
                    username: discordClientID,
                    password: discordClientSecret
                }
            }
        );
        return response.data;
    } catch (error) {
        logger.error(`Error exchanging discord code for access token: ${error}`);
    }
}

// Function to get the user's info
async function getUserInfo(accessToken) {
    try {
        const response = await axios.get(`https://discord.com/api/users/@me`,
            {
                headers: {
                    authorization: `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        logger.error(`Error getting user info for discord user: ${error}`);
    }
}


router.get('/', async (req, res) => {
    const { code } = req.query;
    try {
        // Get the user Id from the session
        const twitchUserId = req.session.userData.id;
        if(!twitchUserId) {
            res.send('No user Id found in session');
        } else {
            const tokenData = await exchangeCode(code);
            const userInfo = await getUserInfo(tokenData.access_token);
            const { id, username } = userInfo;
            usersDB.setDiscordUsername(twitchUserId, username);
            usersDB.setDiscordId(twitchUserId, id);
            // Set the user's discord id in the session
            req.session.userData.discordId = id;
            // Set the user's discord username in the session
            req.session.userData.discordUsername = username;
        }
        res.redirect(`https://${hostName}`);
    } catch (error) {
        logger.error(`Error getting discord user info: ${error}`);
        res.send(error);
    }

})


export default router;