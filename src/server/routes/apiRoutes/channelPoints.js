import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { channelPointsService } from '../../config/initializers.js';

const router = Router();

// Endpoint to get all channel points
router.get('/', async (req, res) => {
    try {
        const response = await channelPointsService.getChannelRewards();
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
        const response = await channelPointsService.getChannelRewardById(req.params.id);
        res.json(response);
    }
    catch (err) {
        console.log('Error in getting a specific channel point from the api: ', err)
        logger.error(`Error in getting a specific channel point from the api: ${err}`);
    }
});

// Endpoint to create a channel point
router.post('/', async (req, res) => {
    try {
        const response = await channelPointsService.createCustomReward(req.body);
        res.json(response);
    }
    catch (err) {
        console.log('Error in creating a channel point from the api: ', err)
        logger.error(`Error in creating a channel point from the api: ${err}`);
    }
});

// Endpoint to update a channel point
router.put('/:id', async (req, res) => {
    try {
        const response = await channelPointsService.updateChannelReward(req.params.id, req.body);
        res.json(response);
    }
    catch (err) {
        console.log('Error in updating a channel point from the api: ', err)
        logger.error(`Error in updating a channel point from the api: ${err}`);
    }
});

// Endpoint to delete a channel point
router.delete('/:id', async (req, res) => {
    try {
        const response = await channelPointsService.deleteChannelReward(req.params.id);
        res.json(response);
    }
    catch (err) {
        console.log('Error in deleting a channel point from the api: ', err)
        logger.error(`Error in deleting a channel point from the api: ${err}`);
    }
});

// Endpoint to toggle a channel point
router.put('/toggle/:id', async (req, res) => {
    try {
        const response = await channelPointsService.toggleChannelReward(req.params.id);
        res.json(response);
    }
    catch (err) {
        console.log('Error in toggling a channel point from the api: ', err)
        logger.error(`Error in toggling a channel point from the api: ${err}`);
    }
});


export default router;