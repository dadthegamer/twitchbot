import { Router } from 'express';
import logger from '../utilities/logger.js';

const router = Router();

router.get('/:element', async (req, res) => {
    try {
        const { element } = req.params;
        res.sendFile(`${element}.html`, { root: './public/html' });
    } catch (error) {
        res.status(404).send("Not found");
        logger.error(`Error in gui.js: ${error}`);
    }
});


export default router;