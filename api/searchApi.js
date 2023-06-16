const searchModel = require('../model/searchModel');
function search(req, res, next) {
	searchModel
		.search(req.body)
		.then((searchResult) => res.status(200).json(searchResult))
		.catch((err) => res.status(500).json({ error: 'server error', message: err }));
}

module.exports = {
	search,
};
