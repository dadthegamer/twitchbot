import { Router } from 'express';
import { actionListService } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import { apiAuth } from '../../middleware/apiAuth.js';

const router = Router();

// Get all the action lists
router.get('/', apiAuth, async (req, res) => {
    try {
        const actions = await actionListService.getActions();
        res.status(200).json(actions);
    }
    catch (err) {
        logger.error(`Error in GET /api/actionList: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get an action list by its id
router.get('/:id', apiAuth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'No action id provided' });
        } else {
            const action = await actionListService.getActionListById(req.params.id);
            res.status(200).json(action);
        }
    }
    catch (err) {
        logger.error(`Error in GET /api/actionList/${req.params.id}: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to create a new action list
router.post('/', apiAuth, async (req, res) => {
    try {
        if (!req.body.actionName || !req.body.actions) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const result = await actionListService.createAction(req.body.actionName, req.body.actions);
        res.status(200).json(result);
    }
    catch (err) {
        logger.error(`Error in POST /api/actionList: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to use an action list
router.post('/:id/use', apiAuth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'No action id provided' });
        }
        const result = await actionListService.useAction(req.params.id, req.body);
        res.status(200).json(result);
    }
    catch (err) {
        logger.error(`Error in POST /api/actionList/${req.params.id}/use: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete an action list
router.delete('/:id', apiAuth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'No action id provided' });
        }
        const result = await actionListService.deleteAction(req.params.id);
        res.status(200).json(result);
    }
    catch (err) {
        logger.error(`Error in DELETE /api/actionList/${req.params.id}: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update an action list
router.put('/:id', apiAuth, async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ error: 'No action id provided' });
        }
        const result = await actionListService.updateAction(req.params.id, req.body.actions);
        res.status(200).json(result);
    }
    catch (err) {
        logger.error(`Error in PUT /api/actionList/${req.params.id}: ${err}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;