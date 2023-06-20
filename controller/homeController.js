// const userModel = require('../model/userModel');
const gameModel = require('../model/gameModel');

function viewHome(req, res, next) {
	// get notificaitons
	// get games
	const games = gameModel.getGames(req.user.id);
	Promise.all([games])
		.then((values) => {
			console.log(values);
			res.render('home', { games: values[0] });
		})
		.catch((err) => res.status(500).json({ error: 'Failed to get home', message: err }));
}

module.exports = {
	viewHome,
};
