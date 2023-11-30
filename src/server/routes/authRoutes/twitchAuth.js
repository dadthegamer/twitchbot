import { Router } from 'express';
import { twitchClientId, twitchClientSecret, redirectUri } from '../../config/environmentVars.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', (req, res) => {
    logger.info('GET /auth/twitch');
    const clientId = twitchClientId;
    const redirectUriEncoded = encodeURIComponent(redirectUri);
    const scopes = encodeURIComponent(
        'user:read:email'
    );
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUriEncoded}&response_type=code&scope=${scopes}`;
    res.redirect(authUrl);
});

export default router;
