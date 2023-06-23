const db = require('../services/database').config;

/**
 * Search for users based on a keyword.
 * @param {string} keyword - The keyword to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of user search results.
 */
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

/**
 * Search for games based on a keyword.
 * @param {string} keyword - The keyword to search for.
 * @returns {Promise<Array>} - A promise that resolves to an array of game search results.
 */
let searchGame = ({ keyword }) =>
	new Promise((resolve, reject) => {
		const gameRequest = `SELECT *, COUNT(user_game.G_ID) AS current_members FROM game LEFT JOIN user_game ON game.G_ID = user_game.G_ID WHERE (game.visibility = 'visible' AND game.name LIKE '%${keyword}%') OR game.G_ID = '${keyword}' AND (game.visibility = 'unlisted' OR game.visibility = 'visible') GROUP BY game.G_ID;`;
		db.query(gameRequest, (err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});

module.exports = {
	searchUser,
	searchGame,
};
