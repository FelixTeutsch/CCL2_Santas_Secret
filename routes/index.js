const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
	// TODO: Check if the user is logged in
	// If he is, show Home page
	// res.redirect('/home');
	// Else show this:
	res.render('landing');
});

router
	.route('/register')
	.post((req, res, next) => {
		// TODO: Implement register Logic
		res.redirect('/');
	})
	.get((req, res, next) => res.render('register'));

router
	.route('/login')
	.post((req, res, next) => {
		// TODO: Implement Login Logic
		res.redirect('/');
	})
	.get((req, res, next) => res.render('login'));

router.all('/logout', (req, res, next) => {
	// TODO: Implement Logout
	res.redirect('/');
});

router.all('/home', (req, res, next) => res.render('home'));

module.exports = router;
