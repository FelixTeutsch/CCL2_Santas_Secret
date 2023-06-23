const userModel = require('../model/userModel');
const gameModel = require('../model/gameModel');
const { authenticateUser, createJWT } = require('../services/authentication');
const fs = require('fs');
const path = require('path');

/**
 * Registers a new user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function registerUser(req, res, next) {
	userModel
		.create(req.body)
		.then(async (result) => {
			const token = await createJWT(result['U_ID'], req.body.username);
			res.cookie('santas_cookies', token, { maxAge: 24 * 60 * 60 * 1000 * 7, httpOnly: true });
			res.redirect('/home');
		})
		.catch((err) => res.status(401).redirect('/register'));
}

/**
 * Logs in a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function loginUser(req, res, next) {
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

/**
 * Logs out the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function logoutUser(req, res, next) {
	res.cookie('santas_cookies', 'santas_cookies', { maxAge: 0 });
	res.redirect('/');
}

/**
 * Retrieves the user's profile.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function getProfile(req, res, next) {
	const userData = userModel.get(req.user.id);
	const gameData = gameModel.getGames(req.user.id);
	Promise.all([userData, gameData])
		.then((values) => {
			res.render('profile/profile', { user: values[0], viewer: req.user, games: values[1] });
		})
		.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to get profile', message: err }));
}

/**
 * Retrieves a user's profile.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function viewProfile(req, res, next) {
	const requestedProfile = req.params.id ? userModel.get(req.params.id) : userModel.get(req.user.id);
	requestedProfile
		.then((user) => {
			// const userData = userModel.get(req.params.id);
			gameModel
				.getGamesWithoutUser(req.user.id, user.U_ID)
				.then((values) => {
					res.render('profile/profile', { user: user, viewer: req.user, games: values });
				})
				.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to get profile', message: err }));
		})
		.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to get profile', message: err }));
}

/**
 * Renders the edit profile page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function edit(req, res, next) {
	userModel
		.get(req.user.id)
		.then((values) => {
			res.render('profile/edit', { user: values });
		})
		.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to get profile', message: err }));
}

/**
 * Updates a user's profile.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function updateProfile(req, res, next) {
	const { username, first_name, last_name } = req.body;
	const U_ID = req.user.id; // Assuming you're using passport or similar authentication middleware

	userModel
		.update(U_ID, { username, first_name, last_name })
		.then(() => {
			res.redirect('/home');
		})
		.catch((error) => {
			res.status(500).render('error', { status: 500, error: 'Failed to update profile', message: error });
		});
}

/**
 * Deletes a user's profile.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function deleteProfile(req, res, next) {
	const U_ID = req.user.id;

	userModel
		.deleteUser(U_ID)
		.then(() => {
			console.log('Profile deleted');
			res.cookie('santas_cookies', 'santas_cookies', { maxAge: 0 });
			res.redirect('/'); // Redirect to the homepage after deleting the profile
		})
		.catch((error) => {
			res.status(500).render('error', { status: 500, error: 'Failed to delete profile', message: error });
		});
}

/**
 * Renders the change picture page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function changePictrue(req, res, next) {
	userModel
		.get(req.user.id)
		.then((user) => {
			res.render('profile/picture', { user: user });
		})
		.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to get profile', message: err }));
}

/**
 * Updates the user's profile picture.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function updatePicture(req, res, next) {
	try {
		if (req.files) {
			let picture = req.files.Picture;
			let filename = './public/images/profile/' + req.user.id + '.jpg';
			picture.mv(filename);
			console.log('File uploaded to ' + filename);
		}
		res.redirect('/profile');
	} catch (err) {
		console.log(err);
	}
}

/**
 * Adds a user to a game.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function addToGame(req, res, next) {
	const U_ID = req.params.id;
	const G_ID = req.body.id;
	console.log('User:', U_ID, 'Game:', G_ID);
	gameModel
		.get(G_ID)
		.then((game) => {
			if (game.stage == 'paused') {
				gameModel
					.joinGame(U_ID, G_ID)
					.then(() => {
						res.redirect('/profile/view/' + U_ID);
					})
					.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to join game', message: err }));
			} else {
				res.status(500).render('error', { status: 500, error: 'Failed to join game', message: 'Game is running' });
			}
		})
		.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to Add to game', message: err }));
}

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	getProfile,
	viewProfile,
	edit,
	updateProfile,
	deleteProfile,
	changePictrue,
	updatePicture,
	addToGame,
};
