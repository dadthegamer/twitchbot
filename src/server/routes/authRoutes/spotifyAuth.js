import { Router } from 'express';
import logger from '../../utilities/logger.js';


const router = Router();

router.get('/', (req, res) => {
    try {
        const clientId = process.env.SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
        const scopes = 'user-read-private user-read-email app-remote-control user-read-playback-state user-modify-playback-state user-read-currently-playing';
        res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`);
    }
    catch (error) {
        logger.error(error);
        res.status(500).send('Error redirecting to Spotify');
    }
});


export default router;
