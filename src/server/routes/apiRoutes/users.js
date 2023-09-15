import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { cache, usersDB } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    console.log('Getting all users');
    try {
        const users = await usersDB.getAllUsers();
        res.json(users);
    }
    catch (err) {
        writeToLogFile('error', `Error in getting users: ${err}`);
        res.status(500).send();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await usersDB.getUserByUserId(req.params.id);
        res.json(user);
    }
    catch (err) {
        writeToLogFile('error', `Error in getting user: ${err}`);
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
        writeToLogFile('error', `Error in updating user: ${err}`);
        console.log(err);
        res.status(500).send();
    }
});


export default router;