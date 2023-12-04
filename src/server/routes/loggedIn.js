import { Router } from 'express';
import logger from '../utilities/logger.js';
import isLoggedIn from '../middleware/loggedin.js'; // Fix the import statement to use 'loggedin' instead of 'loggedIn'

const router = Router();

// Define a route to check if the user is logged in. If they are not logged in, redirect them to the login page.
router.get('/', isLoggedIn, (req, res) => {
    // Get the user data from the session
    const userData = req.session.userData;
    res.status(200).json({ isLoggedIn: true, userData: userData });
});


export default router;