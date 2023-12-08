import { Router } from 'express';
import logger from '../utilities/logger.js';


const router = Router();

// Define a route to check if the user is logged in. If they are not logged in, redirect them to the login page.
router.get('/', (req, res) => {
    try {
        // Get the user data from the session
        const userData = req.session.userData;
        if (userData) {
            // If the user is logged in, render the page
            res.status(200).json({ isLoggedIn: true, userData: userData });
        } else {
            // If the user is not logged in, redirect them to the login page
            res.status(200).json({ isLoggedIn: false });
        }
    }
    catch (err) {
        logger.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;