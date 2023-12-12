import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { cache } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const stream = await cache.get('streamInfo');
        const live = await cache.get('live');
        const data = {
            stream,
            live,
        };
        res.status(200).json(data);
    }
    catch (err) {
        logger.error(`Error in status: ${err}`);
    }
});


export default router;