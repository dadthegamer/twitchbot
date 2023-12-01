import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { commandHandler } from '../../config/initializers.js';
import isLoggedIn from '../../middleware/loggedin.js';

const router = Router();

// Endpoint to get all commands
router.get('/', async (req, res) => {
    try {
        const response = await commandHandler.getAllCommandsFromCache();
        res.json(response);
    }
    catch (err) {
        console.log('Error in getting all commands from the api: ', err)
        logger.error(`Error in getting all commands from the api: ${err}`);
    }
});

// Endpoint to get a command
router.get('/:command', async (req, res) => {
    try {
        const command = await commandHandler.getCommand(req.params.command);
        if (command === null) {
            res.status(404).json({ message: 'Command not found' });
        } else {
            res.json(command);
        }
    }
    catch (err) {
        logger.error(`Error in getting command from the api: ${err}`);
    }
});

// Endpoint to create a command
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const command = await commandHandler.createCommand(req.body.name, req.body.handlers, req.body.description, req.body.permissions, req.body.enabled, req.body.userCooldown, req.body.globalCooldown, req.body.liveOnly);
        res.json(command);
    }
    catch (err) {
        console.log('Error in creating command from the api: ', err)
        logger.error(`Error in creating command from the api: ${err}`);
    }
});

// Endpoint to update a command
router.put('/:command', isLoggedIn, async (req, res) => {
    try {
        const command = await commandHandler.updateCommand(req.body.name, req.body.handlers, req.body.description, req.body.permissions, req.body.enabled, req.body.userCooldown, req.body.globalCooldown, req.body.liveOnly);
        res.json(command);
    }
    catch (err) {
        logger.error(`Error in updating command from the api: ${err}`);
    }
});

// Endpoint to delete a command
router.delete('/:commandName', isLoggedIn, async (req, res) => {
    console.log('Deleting command: ', req.params.commandName)
    try {
        const result = await commandHandler.deleteCommand(req.params.commandName);
        res.json(result);
    }
    catch (err) {
        console.log('Error in deleting command from the api: ', err)
        logger.error(`Error in deleting command from the api: ${err}`);
    }
});

// Endpoint to toggle a command
router.post('/:command', isLoggedIn, async (req, res) => {
    try {
        const { enabled } = req.body;
        const result = await toggleCommand(req.params.command, enabled);
        if (result !== false) {
            res.json({ toggled: true });
        } else {
            res.status(404).json({ toggled: false });
        }
    }
    catch (err) {
        logger.error(`Error in toggling command from the api: ${err}`);
    }
});


export default router;