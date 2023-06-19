const searchModel = require('../model/searchModel');
function search(req, res, next) {
	let userResult;
	searchModel
		.searchUser(req.body)
		.then((result) => {
			userResult = result;
			searchModel.searchGame(req.body);
		})
		.then((result) => {
			res.status(200).json({ userResult, gameResult: result });
		})
		.catch((err) => res.status(500).json({ error: 'server error', message: err }));
}

module.exports = {
	search,
};
