import { Router } from 'express';
import { gameService } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/jackpot', async (req, res) => {
    try {
        const jackpot = await gameService.getJackpot();
        res.json(jackpot);
    } catch (err) {
        logger.error(err);
    }
});

router.put('/jackpot', async (req, res) => {
    try {
        const { jackpot } = req.body;
        const res = await gameService.setJackpot(jackpot);
        res.json(res);
    } catch (err) {
        logger.error(err);
    }
});


export default router;