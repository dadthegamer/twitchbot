import { Router } from 'express';
import { discordClientID, discordRedirectURI, discordClientSecret } from '../../config/environmentVars.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', (req, res) => {
    try {
        const clientId = discordClientID;
        const authUrl = `https://discord.com/oauth2/authorize?response_type=code&client_id=${clientId}&scope=identify&redirect_uri=${discordRedirectURI}`;
        res.redirect(authUrl);
    }
    catch (error) {
        logger.error(error);
        res.status(500).send('Error redirecting to Discord');
    }
});

export default router;