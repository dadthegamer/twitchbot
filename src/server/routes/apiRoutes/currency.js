import { Router } from 'express';
import { usersDB, currencyDB, cache } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import { apiAuth } from '../../middleware/apiAuth.js';


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

router.post('/', apiAuth, async (req, res) => {
    try {
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
            case 'currency-name':
                currendyData.name = value;
                await currencyDB.updateCurrencyById(currencyId, currendyData);
                res.status(200).json(currendyData);
        }
    }
    catch (error) {
        logger.error(`Error creating currency: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/reset', apiAuth, async (req, res) => {
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
});


router.post('/user', apiAuth, async (req, res) => {
    try {
        console.log(req.body);
        const { currencyName, userId, update, value } = req.body;
        // Try to convert the value to a number
        const numberValue = Number(value);
        // If the value is not a number, return an error
        switch (update) {
            case 'add':
                await usersDB.increaseCurrency(userId, currencyName, numberValue);
                res.status(200).json(`Added ${numberValue} ${currencyName} to user ${userId}`);
                break;
            case 'subtract':
                await usersDB.decreaseCurrency(userId, currencyName, numberValue);
                res.status(200).json(`Subtracted ${numberValue} ${currencyName} to user ${userId}`);
                break;
            case 'set':
                await usersDB.setCurrency(userId, currencyName, numberValue);
                res.status(200).json(`Set ${numberValue} ${currencyName} to user ${userId}`);
                break;
        }
    }
    catch (error) {
        logger.error(`Error giving currency to user: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/users', apiAuth, async (req, res) => {
    try {
        const { currenyName, update, viewers, value } = req.body;
        // Try to convert the value to a number
        const numberValue = Number(value);
        // If the value is not a number, return an error
        switch (update) {
            case 'add':
                await usersDB.increaseCurrencyForUsers(viewers, currenyName, numberValue);
                res.status(200).json(`Added ${numberValue} ${currenyName} to ${viewers.length} viewers`);
                break;
            case 'subtract':
                await usersDB.decreaseCurrencyForUsers(viewers, currenyName, numberValue);
                res.status(200).json(`Added ${numberValue} ${currenyName} to ${viewers.length} viewers`);
                break;
            case 'set':
                await usersDB.setCurrencyByViewers(viewers, currenyName, numberValue);
                res.status(200).json(`Added ${numberValue} ${currenyName} to ${viewers.length} viewers`);
                break;
        }
    }
    catch (error) {
        logger.error(`Error giving currency to users: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/viewers', apiAuth, async (req, res) => {
    try {
        const { currenyName, update, value } = req.body;
        const viwers = cache.get('currentViewers');
        // Try to convert the value to a number
        const numberValue = Number(value);
        // If the value is not a number, return an error
        switch (update) {
            case 'add':
                await usersDB.increaseCurrencyForUsers(viwers, currenyName, numberValue);
                res.status(200).json(`Added ${numberValue} ${currenyName} to ${viwers.length} viewers`);
                break;
            case 'subtract':
                await usersDB.decreaseCurrencyForUsers(viwers, currenyName, numberValue);
                res.status(200).json(`Added ${numberValue} ${currenyName} to ${viwers.length} viewers`);
                break;
            case 'set':
                await usersDB.setCurrencyByViewers(viwers, currenyName, numberValue);
                res.status(200).json(`Added ${numberValue} ${currenyName} to ${viwers.length} viewers`);
                break;
        }
    }
    catch (error) {
        logger.error(`Error giving currency to viewers: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/create', apiAuth, async (req, res) => {
    try {
        const { currencyName,
            currencyEnabled,
            payoutInterval,
            payoutAmount,
            payoutSubs,
            payoutSubsMin,
            payoutBits,
            payoutBitsMin,
            payoutDonations,
            payoutDonationsMin,
            payoutRaids,
            payoutFollowers,
            payoutArrival,
            payoutFirst,
            payoutSecond,
            payoutThird,
            payoutHypeTrain,
            bonusModerator,
            bonusSubscriber,
            bonusVip,
            bonusActiveChatUser,
            bonusTier1,
            bonusTier2,
            bonusTier3,
            autoResetValue,
            followersOnly,
            subscribersOnly,
            vipsOnly,
            activeChatUserOnly,
            limitValue } = req.body;

            console.log(req.body);
        // Make sure the currency name is not empty and is a string
        if (currencyName === '' || typeof currencyName !== 'string') {
            res.status(400).json({ error: 'Currency name must be a string and cannot be empty' });
            return;
        }

        // Make sure the enabled value is a boolean value. If it isnt convert it to a boolean value
        if (typeof currencyEnabled !== 'boolean') {
            if (currencyEnabled === 'true') {
                currencyEnabled = true;
            } else {
                currencyEnabled = false;
            }
        }

        // Make sure the limit value is a number. If it isnt convert it to a number
        if (typeof limitValue !== 'number') {
            const numberValue = Number(limitValue);
            if (isNaN(numberValue)) {
                res.status(400).json({ error: 'Limit must be a number' });
                return;
            }
        }

        const payoutSettings = {
            interval: Number(payoutInterval),
            amount: Number(payoutAmount),
            subs: {
                amount: Number(payoutSubs),
                minimum: Number(payoutSubsMin)
            },
            bits: {
                amount: Number(payoutBits),
                minimum: Number(payoutBitsMin)
            },
            donations: {
                amount: Number(payoutDonations),
                minimum: Number(payoutDonationsMin)
            },
            raids: Number(payoutRaids),
            arrived: Number(payoutArrival),
            follower: Number(payoutFollowers),
            first: {
                first: Number(payoutFirst),
                second: Number(payoutSecond),
                third: Number(payoutThird)
            },
            hypeTrain: Number(payoutHypeTrain)
        };

        const roleBonuses = {
            moderator: Number(bonusModerator),
            subscriber: Number(bonusSubscriber),
            vip: Number(bonusVip),
            activeChatUser: Number(bonusActiveChatUser),
            tier1: Number(bonusTier1),
            tier2: Number(bonusTier2),
            tier3: Number(bonusTier3)
        };

        const restrictions = {
            follower: Boolean(followersOnly),
            subscriber: Boolean(subscribersOnly),
            vip: Boolean(vipsOnly),
            activeChatUser: Boolean(activeChatUserOnly)
        };

        const res = await currencyDB.createCurrency(currencyName, currencyEnabled, payoutSettings, roleBonuses, restrictions, limitValue, autoResetValue);
    }
    catch (error) {
        logger.error(`Error creating currency: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.delete('/:id', apiAuth, async (req, res) => {
    try {
        const currency = await currencyDB.deleteCurrencyById(req.params.id);
        res.status(200).json(currency);
    }
    catch (error) {
        logger.error(`Error deleting currency by id: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
