// const userModel = require('../model/userModel');
const gameModel = require('../model/gameModel');

/**
 * Renders the home view with the user's games and notifications.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function viewHome(req, res, next) {
	// Retrieve the user's games
	const games = gameModel
		.getGames(req.user.id)
		.then((values) => {
			res.render('home', { games: values });
		})
		.catch((err) => res.status(500).render('error', { status: 500, error: 'Failed to get home', message: err }));
}

module.exports = {
	viewHome,
};
