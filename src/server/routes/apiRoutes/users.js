import { Router } from 'express';
import { usersDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import { isStreamer, isUser, isUserOrStreamer } from '../../middleware/loggedin.js';
import { apiAuth } from '../../middleware/apiAuth.js';


const router = Router();

router.get('/', isStreamer, async (req, res) => {
    try {
        const users = await usersDB.getAllUsers();
        res.json(users);
    }
    catch (err) {
        logger.error(`Error in getting all users: ${err}`);
        res.status(500).send('Error in getting user by user ID');
    }
});

router.get('/:id', isUserOrStreamer, async (req, res) => {
    try {
        const user = await usersDB.getUserByUserId(req.params.id);
        res.json(user);
    }
    catch (err) {
        logger.error(`Error in getting user by user ID: ${err}`);
        res.status(500).send('Error in getting user by user ID');
    }
});

router.put('/:id', isStreamer, async (req, res) => {
    try {
        const id = req.params.id;
        let { update, value } = req.body;
        const userData = await usersDB.getUserByUserId(id);

        switch (update) {
            case 'all-time-subs':
                userData.subs.allTime = value;
                break;
            case 'yearly-subs':
                userData.subs.yearly = value;
                break;
            case 'monthly-subs':
                userData.subs.monthly = value;
                break;
            case 'weekly-subs':
                userData.subs.weekly = value;
                break;
            case 'stream-subs':
                userData.subs.stream = value;
                break;
            case 'all-time-bits':
                userData.bits.allTime = value;
                break;
            case 'yearly-bits':
                userData.bits.yearly = value;
                break;
            case 'monthly-bits':
                userData.bits.monthly = value;
                break;
            case 'weekly-bits':
                userData.bits.weekly = value;
                break;
            case 'stream-bits':
                userData.bits.stream = value;
                break;
            case 'all-time-donations':
                userData.donations.allTime = value;
                break;
            case 'yearly-donations':
                userData.donations.yearly = value;
                break;
            case 'monthly-donations':
                userData.donations.monthly = value;
                break;
            case 'weekly-donations':
                userData.donations.weekly = value;
                break;
            case 'stream-donations':
                userData.donations.stream = value;
                break;
            case 'all-time-view-time':
                userData.viewTime.allTime = value;
                break;
            case 'yearly-view-time':
                userData.viewTime.yearly = value;
                break;
            case 'monthly-view-time':
                userData.viewTime.monthly = value;
                break;
            case 'weekly-view-time':
                userData.viewTime.weekly = value;
                break;
            case 'stream-view-time':
                userData.viewTime.stream = value;
                break;
            case 'currency':
                const { currency } = req.body;
                // Conver to number
                if (typeof value === 'string') {
                    value = parseInt(value);
                }
                userData.currency[currency] = value;
                break;
            default:
                break;
        }
        await usersDB.updateUserByUserId(id, userData);
        res.json({ message: `Success` });
    }
    catch (err) {
        logger.error(`Error in updating user: ${err}`);
        res.status(500).send('Error in getting user by user ID');
    }
});


export default router;