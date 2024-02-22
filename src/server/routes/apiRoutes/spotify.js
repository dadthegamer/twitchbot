import { Router } from 'express';
import { spotifyService, cache } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

// Route to get the currently playing song
router.get('/', async (req, res) => {
    try {
        const currentlyPlaying = await cache.get('currentlyPlaying');
        res.status(200).json(currentlyPlaying);
    }
    catch (err) {
        logger.error(`Error in GET /api/spotify/currentlyPlaying: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;