// const userModel = require('../model/userModel');
const gameModel = require('../model/gameModel');

function viewHome(req, res, next) {
	// get notificaitons
	// get games
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
