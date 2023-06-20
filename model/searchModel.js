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
		const gameRequest = `SELECT *, COUNT(user_game.G_ID) AS current_members FROM game LEFT JOIN user_game ON game.G_ID = user_game.G_ID WHERE (game.visibility = 'visible' AND game.name LIKE '%${keyword}%') OR game.G_ID = '${keyword}' AND (game.visibility = 'unlisted' OR game.visibility = 'visible') GROUP BY game.G_ID;`;
		db.query(gameRequest, (err, result) => {
			if (err) reject(err);
			console.log(result);
			resolve(result);
		});
	});

module.exports = {
	searchUser,
	searchGame,
};
