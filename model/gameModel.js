const db = require('../services/database').config;

function create({ game_name, member_count, number_of_circles, visibility }, creator) {
	return new Promise((resolve, reject) => {
		const request = 'INSERT INTO `game`(`name`, `creator`, `max_members`, `visibility`) VALUES (?, ?, ?, ?)';
		db.query(request, [game_name, creator, member_count, visibility], (err, res) => {
			if (err) reject(err);
			console.log(res);
			if (res && res.affectedRows > 0) resolve({ G_ID: res.insertId });
		});
	});
}

function get(gameId) {
	return new Promise((resolve, reject) => {
		const request = 'SELECT *, COUNT(user_game.G_ID) AS current_members FROM game LEFT JOIN USER ON game.creator = user.U_ID LEFT JOIN user_game ON game.G_ID = user_game.G_ID WHERE game.G_ID = ? GROUP BY game.G_ID;';
		console.log(request);
		db.query(request, [gameId], (err, res) => {
			if (err) reject(err);
			resolve(res[0]);
		});
	});
}

let getMembers = (gameId) =>
	new Promise((resolve, reject) => {
		const request = 'SELECT * FROM `user_game` LEFT JOIN `user` ON (user_game.U_ID = user.U_ID) WHERE user_game.G_ID = ?';
		db.query(request, [gameId], (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});

function update(gameId, updatedData) {
	return new Promise((resolve, reject) => {
		const request = 'UPDATE `game` SET ? WHERE `G_ID` = ?';
		db.query(request, [updatedData, gameId], (err, res) => {
			if (err) reject(err);
			console.log(res);
			if (res && res.affectedRows > 0) resolve({ message: 'Game updated successfully' });
			else reject(new Error('Game not found'));
		});
	});
}

function remove(gameId) {
	return new Promise((resolve, reject) => {
		const request = 'DELETE FROM `game` WHERE `G_ID` = ?';
		db.query(request, [gameId], (err, res) => {
			if (err) reject(err);
			console.log(res);
			if (res && res.affectedRows > 0) resolve({ message: 'Game deleted successfully' });
			else reject(new Error('Game not found'));
		});
	});
}

let getGames = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `game` WHERE `creator` = ' + db.escape(U_ID);
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let joinGame = (U_ID, G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'INSERT INTO `user_game`(`U_ID`, `G_ID`) VALUES (?, ?)';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

module.exports = {
	create,
	get,
	update,
	delete: remove,
	getGames,
	getMembers,
	joinGame,
};
