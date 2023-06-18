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
	userModel
		.get(req.body.username)
		.then((user) => {
			if (user) {
				authenticateUser(req.body, user, res, next);
				res.redirect('/home');
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
