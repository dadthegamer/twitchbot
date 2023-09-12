import { Router } from 'express';


const router = Router();


router.get('/', async (req, res) => {
    res.sendFile('dashboard.html', { root: './public/html/gui' });
});


router.get('/:page', async (req, res) => {
    try {
        const { page } = req.params;
        res.sendFile(`${page}.html`, { root: './public/html/gui' });
    }
    catch (error) {
        res.status(404).send('Not found');
        writeToLogFile('error', `Error in gui.js: ${error}`);
    }
});


export default router;