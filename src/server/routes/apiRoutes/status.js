import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.json({ online: true });
    }
    catch (err) {
        writeToLogFile('error', `Error in status: ${err}`);
    }
});


export default router;