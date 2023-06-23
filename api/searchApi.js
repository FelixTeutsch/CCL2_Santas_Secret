const searchModel = require('../model/searchModel');

/**
 * Searches for a user based on the provided criteria.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function searchUser(req, res, next) {
	console.log('User requested: ', req.body);
	searchModel
		.searchUser(req.body)
		.then((result) => {
			res.status(200).json({ user: result });
		})
		.then(async (result) => {})
		.catch((err) => res.status(500).json({ error: 'server error', message: err }));
}

/**
 * Searches for a game based on the provided criteria.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function searchGame(req, res, next) {
	searchModel
		.searchGame(req.body)
		.then((result) => {
			res.status(200).json({ game: result });
		})
		.catch((err) => res.status(500).json({ error: 'server error', message: err }));
}

module.exports = {
	searchUser,
	searchGame,
};
