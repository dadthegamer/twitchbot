function ensureAuthenticated(req, res, next) {
    // Check if user data is stored in the session
    if (req.session && req.session.user) {
        return next();  // If they are, continue to the requested route
    } else {
        res.redirect('/login');  // Otherwise, redirect to the login page
    }
}