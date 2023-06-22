const db = require('../services/database').config;

let searchUser = ({ keyword }) =>
	new Promise((resolve, reject) => {
		console.log(keyword);
		const userRequest = `SELECT *, username as name FROM user WHERE username LIKE '%${keyword}%' OR first_name LIKE '%${keyword}%' OR last_name LIKE '%${keyword}%' OR U_ID = '${keyword}';`;
		console.log(userRequest);
		db.query(userRequest, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});

let searchGame = ({ keyword }) =>
	new Promise((resolve, reject) => {
		const gameRequest = `SELECT *, COUNT(user_game.G_ID) AS current_members FROM game LEFT JOIN user_game ON game.G_ID = user_game.G_ID WHERE (game.visibility = 'visible' AND game.name LIKE '%${keyword}%') OR game.G_ID = '${keyword}' AND (game.visibility = 'unlisted' OR game.visibility = 'visible') GROUP BY game.G_ID;`;
		// const gameRequest = `SELECT *, username as name FROM user WHERE username LIKE '%f%' OR first_name LIKE '%f%' OR last_name LIKE '%f%' OR U_ID = 'f';`;
		db.query(gameRequest, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});

module.exports = {
	searchUser,
	searchGame,
};
