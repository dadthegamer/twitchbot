import { Router } from 'express';
import logger from '../../utilities/logger.js';
import axios from 'axios';
import { usersDB, tokenDB, spotifyService } from '../../config/initializers.js';


const router = Router();

router.get('/', async (req, res) => {
    try {
        // Get the code from the callback
        const code = req.query.code || null;
        await spotifyService.exchangeCode(code);
        res.send('Spotify callback');
    }
    catch (error) {
        logger.error(error);
        res.status(500).send('Error with Spotify callback');
    }
});


export default router;
