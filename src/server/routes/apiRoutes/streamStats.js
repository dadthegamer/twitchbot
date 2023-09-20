import { Router } from 'express';
import { cache } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const game = cache.get('streamGame');
        const title = cache.get('streamTitle');
        const live = cache.get('live');
        const currentViewers = cache.get('currentViewers');
        const streamStartedAt = cache.get('streamStartedAt');
        const goalData = cache.get('goals');
        const latestEvents = cache.get('latestEvents');
        const data = {
            streamInfo: {
                game,
                title,
                live,
                currentViewers,
                streamStartedAt,
            },
            goalData,
            latestEvents,
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        logger.error(`Error getting stream stats: ${err}`);
    }
}
);


export default router;