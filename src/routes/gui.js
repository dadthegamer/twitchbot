import { Router } from 'express';


const router = Router();


router.get('/', async (req, res) => {
    res.sendFile('dashboard.html', { root: './public/html/gui' });
});

router.get('/users', async (req, res) => {
    res.sendFile('users.html', { root: './public/html/gui' });
});

router.get('/commands', async (req, res) => {
    res.sendFile('commands.html', { root: './public/html/gui' });
});


export default router;