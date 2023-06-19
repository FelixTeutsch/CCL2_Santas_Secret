const userModel = require('../model/userModel');
const { authenticateUser, createJWT } = require('../services/authentication');

function registerUser(req, res, next) {
	userModel
		.create(req.body)
		.then(async (result) => {
			const token = await createJWT(result.U_ID, result.username);
			res.cookie('token', token, { httpOnly: true });
			res.redirect('/home');
		})
		.catch((err) => res.status(401).redirect('/register'));
}

function loginUser(req, res, next) {
	// TODO: Fix Login with wrong credentials bug
	userModel
		.get(req.body.username)
		.then(async (user) => {
			if (user.length > 0) {
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

module.exports = {
	registerUser,
	loginUser,
};
