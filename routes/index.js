const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');

router.get('/', function (req, res, next) {
	if (req.isAuthenticated) {
		res.redirect('/home');
	} else {
		res.render('landing');
	}
});

router
	.route('/register')
	.post(userController.registerUser)
	.get((req, res, next) => res.render('register'));

router
	.route('/login')
	.post(userController.loginUser)
	.get((req, res, next) => (req.isAuthenticated ? res.redirect('/home') : res.render('login')));

router.all('/logout', userController.logoutUser);

router.all('/home', (req, res, next) => {
	if (!req.isAuthenticated) res.redirect('/');
	else res.render('home');
});

module.exports = router;
