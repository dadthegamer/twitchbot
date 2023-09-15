import { Router } from 'express';
import { twitchClientId } from '../../config/environmentVars.js';

const router = Router();

router.get('/', (req, res) => {
    console.log(`Twitch admin auth route hit`)
    const clientId = process.env.TWITCH_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.TWITCH_REDIRECT_URI);
    const scopes = encodeURIComponent(
        'user:read:email ' +
        'analytics:read:games ' +
        'analytics:read:extensions ' +
        'bits:read ' +
        'channel:read:subscriptions ' +
        'channel:manage:broadcast ' +
        'channel:edit:commercial ' +
        'channel:read:goals ' +
        'channel:read:hype_train ' +
        'channel:read:polls ' +
        'channel:manage:polls ' +
        'channel:read:predictions ' +
        'channel:manage:predictions ' +
        'channel:manage:raids ' +
        'channel:read:redemptions ' +
        'channel:manage:redemptions ' +
        'channel:manage:schedule ' +
        'channel:read:stream_key ' +
        'channel:manage:videos ' +
        'channel:read:vips ' +
        'channel:manage:vips ' +
        'clips:edit ' +
        'moderation:read ' +
        'moderator:manage:announcements ' +
        'moderator:manage:automod ' +
        'moderator:manage:banned_users ' +
        'moderator:read:chatters ' +
        'moderator:read:followers ' +
        'moderator:read:shoutouts ' +
        'moderator:manage:shoutouts ' +
        'user:edit ' +
        'user:manage:blocked_users ' +
        'user:read:blocked_users ' +
        'user:read:broadcast ' +
        'user:read:follows ' +
        'user:read:subscriptions ' +
        'channel:moderate ' +
        'chat:edit ' +
        'chat:read'
    );
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scopes}`;
    res.redirect(authUrl);
});

export default router;
