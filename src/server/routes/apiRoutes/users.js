import { Router } from 'express';
import { cache, usersDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const users = await usersDB.getAllUsers();
        res.json(users);
    }
    catch (err) {
        logger.error(`Error in getting all users: ${err}`);
        res.status(500).send();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await usersDB.getUserByUserId(req.params.id);
        res.json(user);
    }
    catch (err) {
        logger.error(`Error in getting user by user ID: ${err}`);
        res.status(500).send();
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Get all the properties to update
        const properties = Object.keys(req.body);
        // Get the values tp update
        const values = Object.values(req.body);

        // For each property, update the user
        for (let i = 0; i < properties.length; i++) {
            console.log(`Updating ${properties[i]} to ${values[i]}`);
        }
        res.json({ message: `Success` });
    }
    catch (err) {
        logger.error(`Error in updating user: ${err}`);
        res.status(500).send();
    }
});


export default router;