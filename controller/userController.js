const userModel = require('../model/userModel');
const gameModel = require('../model/gameModel');
const { authenticateUser, createJWT } = require('../services/authentication');

function registerUser(req, res, next) {
	userModel
		.create(req.body)
		.then(async (result) => {
			console.log(result + ' created');
			console.log(req.body.username, req.body.password);
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

function getProfile(req, res, next) {
	const userData = userModel.get(req.user.id);
	const gameData = gameModel.getGames(req.user.id);
	Promise.all([userData, gameData])
		.then((values) => {
			console.log(values);
			res.render('profile/profile', { user: values[0], viewer: req.user, games: values[1] });
		})
		.catch((err) => res.status(500).json({ error: 'Failed to get profile', message: err }));
}

function viewProfile(req, res, next) {
	const requestedProfile = req.params.id ? userModel.get(req.params.id) : userModel.get(req.user.id);
	// const userData = userModel.get(req.params.id);
	const gameData = gameModel.getGames(req.user.id);
	Promise.all([requestedProfile, gameData])
		.then((values) => {
			console.log(values);
			res.render('profile/profile', { user: values[0], viewer: req.user, games: values[1] });
		})
		.catch((err) => res.status(500).json({ error: 'Failed to get profile', message: err }));
}
module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	getProfile,
	viewProfile,
};
