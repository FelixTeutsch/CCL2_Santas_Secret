const express = require('express');
const router = express.Router();

router.get('/', function (req, res, next) {
	res.render('template', { title: 'Express' });
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

module.exports = router;
