import { Router } from 'express';
import { twitchClientId, twitchClientSecret } from '../../config/environmentVars';

const router = Router();

router.get('/', (req, res) => {
    const clientId = twitchClientId;
    const redirectUri = encodeURIComponent(twitchClientSecret);
    const scopes = encodeURIComponent(
        'user:read:email'
    );
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    res.redirect(authUrl);
});

export default router;
