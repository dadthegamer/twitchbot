import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { apiAuth } from '../../middleware/apiAuth.js';
import { addAlert } from '../../handlers/alertHandler.js';

const router = Router();

router.get('/:type', apiAuth, async (req, res) => {
    try {
        const type = req.params.type;
        switch (type) {
            case 'follow':
                console.log('follow');
                addAlert('12345', 'testUser', 'follow', 'testUser just followed!');
                break;
            case 'cheer':
                console.log('cheer');
                addAlert('12345', 'testUser', 'cheer', 'testUser just cheered!');
                break;
            case 'donation':
                console.log('donation');
                addAlert('12345', 'testUser', 'donation', 'testUser just donated!');
                break;
            case 'sub':
                console.log('sub');
                addAlert('12345', 'testUser', 'sub', 'testUser just subscribed!');
                break;
            case 'resub':
                console.log('resub');
                addAlert('12345', 'testUser', 'resub', 'testUser just resubscribed!');
                break;
            case 'giftedSub':
                console.log('giftedSub');
                addAlert('12345', 'testUser', 'giftedSub', 'testUser just gifted a sub!');
                break;
        }
        return res.status(200);
    }
    catch (err) {
        logger.error(`Error in status: ${err}`);
    }
});


export default router;