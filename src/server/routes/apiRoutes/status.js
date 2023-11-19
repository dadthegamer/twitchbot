import { Router } from 'express';
import { cache, chatClient } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.json({ online: true });
    }
    catch (err) {
        logger.error(`Error in status: ${err}`);
    }
});


export default router;