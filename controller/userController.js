const userModel = require('../model/userModel');
const { authenticateUser, createJWT } = require('../services/authentication');

function registerUser(req, res, next) {
	userModel
		.create(req.body)
		.then((result) => {
			res.redirect('/home');
		})
		.catch((err) => next(err));
}

function loginUser(req, res, next) {
	userModel.get(req.body).then((user) => {
		if (user) {
			authenticateUser(req, res, next);
			res.redirect('/home');
		}
	});
}

module.exports = {
	registerUser,
	loginUser,
};
