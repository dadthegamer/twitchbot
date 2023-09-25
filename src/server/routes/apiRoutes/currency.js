import { Router } from 'express';
import { usersDB, currencyDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();


router.get('/', async (req, res) => {
    try {
        const currencies = await currencyDB.getAllCurrencies();
        res.status(200).json(currencies);
    }
    catch (error) {
        logger.error(`Error getting all currencies: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const currency = await currencyDB.getCurrencyById(req.params.id);
        res.status(200).json(currency);
    }
    catch (error) {
        logger.error(`Error getting currency by id: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { currencyId, update, value } = req.body;
        const currendyData = await currencyDB.getCurrencyById(currencyId);
        
    }
    catch (error) {
        logger.error(`Error creating currency: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
