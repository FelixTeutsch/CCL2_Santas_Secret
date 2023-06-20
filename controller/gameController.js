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

function getGame(req, res, next) {
	console.log(req.params.id);
	gameModel
		.get(req.params.id)
		.then((result) => {
			console.log(result);
			res.render('game/game', { game: result, user: req.user });
		})
		.catch((error) => res.status(500).json({ error: 'Failed to get game', message: error }));
}

function updateGame(req, res, next) {
	console.log(req.params.id, req.body);
	gameModel
		.update(req.params.id, req.body)
		.then((result) => {
			console.log(result);
			res.json({ message: 'Game updated successfully' });
		})
		.catch((error) => res.status(500).json({ error: 'Failed to update game', message: error }));
}

function deleteGame(req, res, next) {
	console.log(req.params.id);
	gameModel
		.delete(req.params.id)
		.then((result) => {
			console.log(result);
			res.json({ message: 'Game deleted successfully' });
		})
		.catch((error) => res.status(500).json({ error: 'Failed to delete game', message: error }));
}

module.exports = {
	createGame,
	getGame,
	updateGame,
	deleteGame,
};
