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
        // Try to convert the value to a number
        const numberValue = Number(value);
        // If the value is not a number, return an error
        switch (update) {
            case 'payout-interval':
                currendyData.payoutSettings.interval = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-amount':
                currendyData.payoutSettings.amount = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-subs':
                currendyData.payoutSettings.subs.amount = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-subs-min':
                currendyData.payoutSettings.subs.min = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-bits':
                currendyData.payoutSettings.bits.amount = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-bits-min':
                currendyData.payoutSettings.bits.min = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-donations':
                currendyData.payoutSettings.donations.amount = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-donations-min':
                currendyData.payoutSettings.donations.min = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-raids':
                currendyData.payoutSettings.raids = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-followers':
                currendyData.payoutSettings.followers = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-first':
                currendyData.payoutSettings.first.first = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-second':
                currendyData.payoutSettings.first.second = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-third':
                currendyData.payoutSettings.first.third = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case 'payout-hype-train':
                currendyData.payoutSettings.hypeTrain = numberValue;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
            case `toggle-currency-checkbox-${currencyId}`:
                try {
                    if (numberValue === 1) {
                        currendyData.enabled = true;
                    } else {
                        currendyData.enabled = false;
                    }
                    await currencyDB.updateCurrencyById(currencyId, currendyData);
                    res.status(200).json(currendyData);
                    break;
                }
                catch (error) {
                    console.log(error);
                    logger.error(`Error updating currency: ${error}`);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            case 'auto-reset':
                if (value === 'False') {
                    currendyData.autoReset = false;
                } else {
                    currendyData.autoReset = value;
                }
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
                break;
        }
    }
    catch (error) {
        logger.error(`Error creating currency: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/reset', async (req, res) => {
    try {
        const { currencyId } = req.body;
        const currendyData = await currencyDB.getCurrencyById(currencyId);
        await usersDB.resetCurrency(currendyData.name);
        res.status(200).json(currendyData);
    }
    catch (error) {
        console.log(error);
        logger.error(`Error creating currency: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
);

export default router;
