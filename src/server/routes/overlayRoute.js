import { Router } from 'express';
import { writeToLogFile } from '../utilities/logging.js';

const router = Router();

router.get('/:element', async (req, res) => {
    try {
        const { element } = req.params;
        res.sendFile(`${element}.html`, { root: './public/html' });
    } catch (error) {
        res.status(404).send("Not found");
        writeToLogFile('error', `Error in overlay.js: ${error}`);
    }
});


export default router;