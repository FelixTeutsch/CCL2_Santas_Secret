const userModel = require('../model/userModel');
const { authenticateUser, createJWT } = require('../services/authentication');

function registerUser(req, res, next) {
	userModel
		.create(req.body)
		.then(async (result) => {
			console.log(result + ' created');
			const token = await createJWT(result['U_ID'], req.body.username);
			res.cookie('santas_cookies', token, { maxAge: 24 * 60 * 60 * 1000 * 7, httpOnly: true });
			res.redirect('/home');
		})
		.catch((err) => res.status(401).redirect('/register'));
}

function loginUser(req, res, next) {
	// TODO: Fix Login with wrong credentials bug
	userModel
		.get(req.body.username)
		.then(async (user) => {
			if (user) {
				if (await authenticateUser(req.body, user, res, next)) res.redirect('/home');
				else res.redirect('/login');
			} else {
				console.log('User not found');
				res.redirect('/login');
			}
		})
		.catch((err) => {
			console.log(err);
			res.redirect('/login');
		});
}

function logoutUser(req, res, next) {
	res.cookie('santas_cookies', 'santas_cookies', { maxAge: 0 });
	res.redirect('/');
}
module.exports = {
	registerUser,
	loginUser,
	logoutUser,
};
