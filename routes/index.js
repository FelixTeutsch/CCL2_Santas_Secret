const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');

/**
 * Route for handling the index page.
 * If the user is authenticated, it redirects to the home page.
 * Otherwise, it renders the landing page.
 * HTTP Method: GET
 * Endpoint: /
 */
router.get('/', function (req, res, next) {
	if (req.isAuthenticated) {
		res.redirect('/home');
	} else {
		res.render('landing');
	}
});

// Register route
router
	.route('/register')
	/**
	 * Handle user registration.
	 * HTTP Method: POST
	 * Endpoint: /register
	 */
	.post(userController.registerUser)
	/**
	 * Render the registration form.
	 * HTTP Method: GET
	 * Endpoint: /register
	 */
	.get((req, res, next) => res.render('register'));

// Login route
router
	.route('/login')
	/**
	 * Handle user login.
	 * HTTP Method: POST
	 * Endpoint: /login
	 */
	.post(userController.loginUser)
	/**
	 * Render the login form.
	 * If the user is authenticated, it redirects to the home page.
	 * HTTP Method: GET
	 * Endpoint: /login
	 */
	.get((req, res, next) => (req.isAuthenticated ? res.redirect('/home') : res.render('login')));

// Logout route
router.all('/logout', userController.logoutUser);

module.exports = router;
