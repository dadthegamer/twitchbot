import { Router } from 'express';
import { cache } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();



router.get('/', async (req, res) => {
    try {
        const prediction = cache.get('prediction');
        if (prediction === undefined) {
            res.json({ prediction: 'No prediction currently running' });
        } else {
            res.json({ prediction: prediction });
        }
    }
    catch (err) {
        logger.error(`Error in prediction.js: ${err}`);
        res.status(500).send();
    }
});


export default router;