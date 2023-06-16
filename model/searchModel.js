const db = require('../services/database').config;

let search = (keyword) =>
	new Promise((resolve, reject) => {
		// Check if it is like the User
		const db_keyword = db.escape(keyword);
		const userRequest = `SELECT * FROM 'user' WHERE visibility = 'visible' AND (username LIKE ${db_keyword} OR first_name LIKE ${db_keyword}) OR U_ID = ${db_keyword} AND visibility = 'unlisted'`;
		const gameRequest = `SELECT * FROM 'game' WHERE visibility = 'visible' AND name LIKE ${db_keyword}) OR G_ID = ${db_keyword} AND (visibility = 'unlisted' OR visibility = 'visible'`;
	});

module.exports = {
	search,
};
