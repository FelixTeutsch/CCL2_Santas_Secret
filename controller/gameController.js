const gameModel = require('../model/gameModel');

function createGame(req, res, next) {
	console.log(req.body, req.user.id);
	gameModel
		.create(req.body, req.user.id)
		.then((result) => {
			console.log(result);
			gameModel.joinGame(req.user.id, result.G_ID);
			res.redirect('/game/' + result.G_ID);
		})
		.catch((error) => res.status(500).json({ error: 'Failed to create game', message: error }));
}

function getGame(req, res, next) {
	const game = gameModel.get(req.params.id);
	const members = gameModel.getMembers(req.params.id);

	Promise.all([game, members])
		.then((result) => {
			res.render('game/game', { game: result[0], user: req.user, members: result[1] });
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

function joinGame(req, res, next) {
	console.log(req.params.id, req.user.id);
	gameModel
		.joinGame(req.user.id, req.params.id)
		.then((result) => {
			console.log(result);
			res.redirect('/game/' + req.params.id);
		})
		.catch((error) => res.status(500).json({ error: 'Failed to join game', message: error }));
}

module.exports = {
	createGame,
	getGame,
	updateGame,
	deleteGame,
	joinGame,
};
