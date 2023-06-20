const gameModel = require('../model/gameModel');

function createGame(req, res, next) {
	console.log(req.body, req.user.id);
	gameModel
		.create(req.body, req.user.id)
		.then((result) => {
			console.log(result);
			res.redirect('/game/' + result.G_ID);
		})
		.catch((error) => res.status(500).json({ error: 'Failed to create game', message: error }));
}

module.exports = {
	createGame,
};
