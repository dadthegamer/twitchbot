import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { cache } from '../../config/initializers.js';

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
        writeToLogFile('error', `Error in getting prediction: ${err}`);
        res.status(500).send();
    }
});


export default router;