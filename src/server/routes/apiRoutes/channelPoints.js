import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { channelPointService } from '../../config/initializers.js';
import { apiAuth } from '../../middleware/apiAuth.js';


const router = Router();

// Endpoint to get all channel points
router.get('/', async (req, res) => {
    try {
        const response = await channelPointService.getChannelRewards();
        res.json(response);
    }
    catch (err) {
        console.log('Error in getting all channel points from the api: ', err)
        logger.error(`Error in getting all channel points from the api: ${err}`);
    }
});

// Endpoint to get a specific channel point
router.get('/:id', async (req, res) => {
    try {
        const response = await channelPointService.getChannelRewardById(req.params.id);
        res.json(response);
    }
    catch (err) {
        console.log('Error in getting a specific channel point from the api: ', err)
        logger.error(`Error in getting a specific channel point from the api: ${err}`);
    }
});

// Endpoint to create a channel point
router.post('/', apiAuth, async (req, res) => {
    try {
        const { title, prompt, cost, userInputRequired, backgroundColor, globalCooldown, maxRedemptionsPerStream, maxRedemptionsPerUserPerStream, handlers } = req.body;
        const response = await channelPointService.createCustomReward(title, prompt, cost, userInputRequired, backgroundColor, globalCooldown, maxRedemptionsPerStream, maxRedemptionsPerUserPerStream, handlers);
        res.json(response);
    }
    catch (err) {
        console.log('Error in creating a channel point from the api: ', err)
        logger.error(`Error in creating a channel point from the api: ${err}`);
    }
});

// Endpoint to update a channel point
router.put('/:id', apiAuth, async (req, res) => {
    try {
        const response = await channelPointService.updateChannelReward(req.params.id, req.body);
        res.json(response);
    }
    catch (err) {
        console.log('Error in updating a channel point from the api: ', err)
        logger.error(`Error in updating a channel point from the api: ${err}`);
    }
});

// Endpoint to delete a channel point
router.delete('/:id', apiAuth, async (req, res) => {
    try {
        const response = await channelPointService.deleteChannelReward(req.params.id);
        res.json( { success: true });
    }
    catch (err) {
        console.log('Error in deleting a channel point from the api: ', err)
        logger.error(`Error in deleting a channel point from the api: ${err}`);
    }
});

// Endpoint to toggle a channel point
router.put('/toggle/:id', apiAuth, async (req, res) => {
    try {
        await channelPointService.toggleChannelReward(req.params.id, req.body.isEnabled);
        res.json({ success: true });
    }
    catch (err) {
        console.log('Error in toggling a channel point from the api: ', err)
        logger.error(`Error in toggling a channel point from the api: ${err}`);
        res.json({ success: false });
    }
});


export default router;