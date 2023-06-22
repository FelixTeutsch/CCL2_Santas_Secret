const db = require('../services/database').config;

let getYourSanta = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user_game`AS ug LEFT JOIN `user` AS u ON ug.U_ID = u.U_ID WHERE ug.recipient = ? AND ug.G_ID = ?;';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let getYourTarget = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user_game`AS ug LEFT JOIN `user` AS u ON ug.recipient = u.U_ID WHERE ug.U_ID = ? AND ug.G_ID = ?;';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

function create({ game_name, description, member_count, number_of_circles, visibility }, creator) {
	return new Promise((resolve, reject) => {
		const request = 'INSERT INTO `game`(`name`, `description`, `creator`, `max_members` ,`visibility`) VALUES (?, ?, ?, ?,?)';
		db.query(request, [game_name, description, creator, member_count, visibility], (err, res) => {
			if (err) reject(err);
			if (res && res.affectedRows > 0) resolve({ G_ID: res.insertId });
		});
	});
}

function get(gameId) {
	return new Promise((resolve, reject) => {
		const request = 'SELECT game.*, user.*, IFNULL(COUNT(user_game.G_ID), 0) AS current_members FROM game LEFT JOIN user ON game.creator = user.U_ID LEFT JOIN user_game ON game.G_ID = user_game.G_ID WHERE game.G_ID = ? GROUP BY game.G_ID;';
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

let getGames = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT *, IFNULL(COUNT(ug.G_ID), 0) AS current_members FROM `game` AS g LEFT JOIN user_game AS ug ON g.G_ID = ug.G_ID  WHERE `creator` = ' + db.escape(U_ID) + ' OR `U_ID` = ' + db.escape(U_ID) + ' GROUP BY g.G_ID';
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});
let getGamesWithoutUser = (U_ID, other_user) =>
	new Promise((resolve, reject) => {
		// const sql = 'SELECT * FROM `game` AS g LEFT JOIN user_game AS ug ON g.G_ID = ug.G_ID  WHERE `creator` = ' + db.escape(U_ID) + ' AND `U_ID` <> ' + db.escape(other_user) + '  GROUP BY g.G_ID';
		const sql = 'SELECT g.* FROM `game` AS g LEFT JOIN user_game AS ug ON g.G_ID = ug.G_ID AND ug.U_ID = ' + db.escape(other_user) + ' WHERE g.creator = ' + db.escape(U_ID) + ' AND ug.U_ID IS NULL;';
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

let startGame = (G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `game` SET `stage` = "running" WHERE `G_ID` = ?';
		db.query(sql, [G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let endGame = (G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `game` SET `stage` = "ended" WHERE `G_ID` = ' + G_ID;
		db.query(sql, [G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let assignSantas = (assignedMembers, G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE user_game SET recipient = NULL WHERE G_ID = ' + G_ID + '; UPDATE `user_game` SET `recipient` = CASE `U_ID` ';

		const updateCases = assignedMembers.map((assignedMember) => {
			return `WHEN ${assignedMember.member} THEN ${assignedMember.assigned} `;
		});

		const updateValues = assignedMembers.map((assignedMember) => assignedMember.member);

		const whereCondition = 'END WHERE `G_ID` = ?';

		const query = sql + updateCases.join('') + whereCondition;

		const params = updateValues.concat(G_ID);

		db.query(query, [G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let restartGame = (G_ID, creator) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `game` SET `stage` = "paused" WHERE `G_ID` = ?; UPDATE `user_game` SET `recipient` = NULL WHERE `G_ID` = ?; ';
		db.query(sql, [G_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

function update(gameId, updatedData) {
	return new Promise((resolve, reject) => {
		const request = 'UPDATE `game` SET ? WHERE `G_ID` = ?';
		db.query(request, [updatedData, gameId], (err, res) => {
			if (err) reject(err);
			if (res && res.affectedRows > 0) resolve({ message: 'Game updated successfully' });
			else reject(new Error('Game not found'));
		});
	});
}

function deleteGame(gameId, U_ID) {
	return new Promise((resolve, reject) => {
		const request = 'DELETE FROM `game` WHERE `G_ID` = ? AND `creator` = ?';
		db.query(request, [gameId, U_ID], (err, res) => {
			if (err) reject(err);
			if (res && res.affectedRows > 0) resolve({ message: 'Game deleted successfully' });
			else reject(new Error('Game not found'));
		});
	});
}

function remove(gameId, userId) {
	return new Promise((resolve, reject) => {
		const request = 'DELETE FROM `user_game` WHERE `G_ID` = ? AND `U_ID` = ?';
		db.query(request, [gameId, userId], (err, res) => {
			if (err) reject(err);
			if (res && res.affectedRows > 0) resolve({ message: 'User removed' });
			else reject(new Error('Game not found'));
		});
	});
}

let checkAdmin = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `game` WHERE `G_ID` = ? AND `creator` = ?';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results.length > 0);
		});
	});

let checkMember = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user_game` WHERE `G_ID` = ? AND `U_ID` = ?';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results.length > 0);
		});
	});

let deleteAllChats = (G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'DELETE FROM `chat` WHERE `game` = ' + G_ID;
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let createChats = (members, G_ID) =>
	new Promise((resolve, reject) => {
		const sqlStart = 'INSERT INTO `chat`(`game`, user_giver, user_receiver) VALUES ';
		const sqlMiddle = members
			.map((member) => {
				return `(${G_ID}, ${member.member}, ${member.assigned})`;
			})
			.join(', ');
		const sqlEnd = ';';
		const sql = sqlStart + sqlMiddle + sqlEnd;
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let chatSanta = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM message AS m LEFT JOIN chat AS c ON m.chat = c.C_ID WHERE c.game = ? AND c.user_receiver = ? ORDER BY m.timestamp DESC';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let chatSantaId = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT C_ID FROM chat WHERE user_receiver = ? AND game = ?';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results[0].C_ID);
		});
	});

let sendMessage = (chatId, sender, message) =>
	new Promise((resolve, reject) => {
		const sql = 'INSERT INTO `message`(`chat`, `message_content`, `sender`) VALUES (?, ?, ?)';
		db.query(sql, [chatId, message, sender], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let chatRecipient = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM message AS m LEFT JOIN chat AS c ON m.chat = c.C_ID WHERE c.game = ? AND c.user_giver = ? ORDER BY m.timestamp DESC';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

let chatRecipientId = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT C_ID FROM chat WHERE user_giver = ? AND game = ?';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			if (results.length > 0) {
				resolve(results[0].C_ID);
			} else reject('No chat found');
		});
	});
let getRecipient = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM chat AS c LEFT JOIN `user` AS u ON c.user_receiver = u.U_ID WHERE c.user_giver = ? AND c.game = ? GROUP BY c.user_receiver';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			if (results.length > 0) {
				resolve(results[0]);
			} else reject('No chat found');
		});
	});
let getSanta = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM chat AS c LEFT JOIN `user` AS u ON c.user_giver = u.U_ID WHERE c.user_receiver = ? AND c.game = ? GROUP BY c.user_giver';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			if (results.length > 0) {
				resolve(results[0]);
			} else reject('No chat found');
		});
	});

module.exports = {
	create,
	get,
	update,
	remove,
	deleteGame,
	getGames,
	getGamesWithoutUser,
	getMembers,
	joinGame,
	startGame,
	endGame,
	assignSantas,
	getYourSanta,
	getYourTarget,
	restartGame,
	checkMember,
	checkAdmin,
	deleteAllChats,
	createChats,
	chatSanta,
	chatSantaId,
	sendMessage,
	chatRecipient,
	chatRecipientId,
	getRecipient,
	getSanta,
};
