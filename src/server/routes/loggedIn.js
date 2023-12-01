import { Router } from 'express';
import logger from '../../utilities/logger.js';
import isLoggedIn from '../../middleware/loggedin.js';

const router = Router();

router.get('/', isLoggedIn, async (req, res) => {
    try {
        res.json({ online: true });
    }
    catch (err) {
        logger.error(`Error in status: ${err}`);
    }
});


export default router;