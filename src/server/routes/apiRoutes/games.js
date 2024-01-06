import { Router } from 'express';
import { gameService } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import isStreamer from '../../middleware/loggedin.js';


const router = Router();

router.get('/jackpot', isStreamer, async (req, res) => {
    try {
        const jackpot = await gameService.getJackpot();
        res.json(jackpot);
    } catch (err) {
        logger.error(err);
    }
});

router.put('/jackpot', isStreamer, async (req, res) => {
    try {
        const { update } = req.body;
        if (update === 'jackpot') {
            const { jackpot } = req.body;
            await gameService.setJackpot(jackpot);
            res.sendStatus(200);
        } else if (update === 'jackpotPCT') {
            const { jackpotPCT } = req.body;
            await gameService.updateJackpotPCT(jackpotPCT);
            res.sendStatus(200);
        } else if (update === 'increaseBy'){
            const { min, max } = req.body;
            await gameService.updateIncreaseBy(min, max);
            res.sendStatus(200);
        } else if (update === 'currency') {
            const { currency } = req.body;
            await gameService.setCurrency(currency);
            res.sendStatus(200);
        }
        else {
            res.sendStatus(400);
        }
    } catch (err) {
        logger.error(err);
    }
});


export default router;