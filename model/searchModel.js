const db = require('../services/database').config;

let searchUser = ({ keyword }) =>
	new Promise((resolve, reject) => {
		const userRequest = `SELECT *, username as name FROM user WHERE (visibility = 'visible' AND (username LIKE '%${keyword}%' OR first_name LIKE '%${keyword}%' OR last_name LIKE '%${keyword}%')) OR (U_ID = '${keyword}' AND visibility = 'unlisted');`;
		db.query(userRequest, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});

let searchGame = ({ keyword }) =>
	new Promise((resolve, reject) => {
		const gameRequest = `SELECT * FROM game WHERE (visibility = 'visible' AND name LIKE '%${keyword}%') OR G_ID = '${keyword}' AND (visibility = 'unlisted' OR visibility = 'visible')`;
		db.query(gameRequest, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});

module.exports = {
	searchUser,
	searchGame,
};
