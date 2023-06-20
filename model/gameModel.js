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
		const request = 'SELECT * FROM `game` LEFT JOIN `user` ON (game.creator = user.U_ID) WHERE `G_ID` = ?';
		db.query(request, [gameId], (err, res) => {
			if (err) reject(err);
			if (res && res.length > 0) resolve(res[0]);
			else reject(new Error('Game not found'));
		});
	});
}

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

module.exports = {
	create,
	get,
	update,
	delete: remove,
};
