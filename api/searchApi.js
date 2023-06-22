const searchModel = require('../model/searchModel');
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
