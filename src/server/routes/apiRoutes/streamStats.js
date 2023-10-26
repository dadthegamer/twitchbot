import { Router } from 'express';
import { cache } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const streamInfo = cache.get('streamInfo');
        const live = cache.get('live');
        const currentViewers = cache.get('currentViewers');
        const streamStartedAt = cache.get('streamStartedAt');
        const goalData = cache.get('goals');
        const latestEvents = cache.get('latestEvents');
        const data = {
            streamInfo: {
                streamInfo,
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