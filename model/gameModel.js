const db = require('../services/database').config;

/**
 * Retrieves the information of the Santa associated with the given G_ID and U_ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to the Santa information.
 */
let getYourSanta = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user_game`AS ug LEFT JOIN `user` AS u ON ug.U_ID = u.U_ID WHERE ug.recipient = ? AND ug.G_ID = ?;';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Retrieves the information of the target associated with the given G_ID and U_ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to the target information.
 */
let getYourTarget = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user_game`AS ug LEFT JOIN `user` AS u ON ug.recipient = u.U_ID WHERE ug.U_ID = ? AND ug.G_ID = ?;';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Creates a new game with the provided data.
 *
 * @param game_name          The name of the game.
 * @param description        The description of the game.
 * @param member_count       The number of members in the game.
 * @param number_of_circles  The number of circles in the game.
 * @param visibility         The visibility of the game.
 * @param creator            The creator of the game.
 * @return A Promise that resolves to the newly created game.
 */
function create({ game_name, description, member_count, number_of_circles, visibility }, creator) {
	return new Promise((resolve, reject) => {
		const request = 'INSERT INTO `game`(`name`, `description`, `creator`, `max_members` ,`visibility`) VALUES (?, ?, ?, ?,?)';
		db.query(request, [game_name, description, creator, member_count, visibility], (err, res) => {
			if (err) reject(err);
			if (res && res.affectedRows > 0) resolve({ G_ID: res.insertId });
		});
	});
}

/**
 * Retrieves the game information for the given game ID.
 *
 * @param gameId The game ID.
 * @return A Promise that resolves to the game information.
 */
function get(gameId) {
	return new Promise((resolve, reject) => {
		const request = 'SELECT game.*, user.*, IFNULL(COUNT(user_game.G_ID), 0) AS current_members FROM game LEFT JOIN user ON game.creator = user.U_ID LEFT JOIN user_game ON game.G_ID = user_game.G_ID WHERE game.G_ID = ? GROUP BY game.G_ID;';
		db.query(request, [gameId], (err, res) => {
			if (err) reject(err);
			resolve(res[0]);
		});
	});
}

/**
 * Retrieves the members of the game with the provided game ID.
 *
 * @param gameId The game ID.
 * @return A Promise that resolves to the list of members.
 */
let getMembers = (gameId) =>
	new Promise((resolve, reject) => {
		const request = 'SELECT * FROM `user_game` LEFT JOIN `user` ON (user_game.U_ID = user.U_ID) WHERE user_game.G_ID = ?';
		db.query(request, [gameId], (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});

/**
 * Retrieves the games associated with the given user ID.
 *
 * @param U_ID The user ID.
 * @return A Promise that resolves to the list of games.
 */
let getGames = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT *, IFNULL(COUNT(ug.G_ID), 0) AS current_members FROM `game` AS g LEFT JOIN user_game AS ug ON g.G_ID = ug.G_ID  WHERE `creator` = ' + db.escape(U_ID) + ' OR `U_ID` = ' + db.escape(U_ID) + ' GROUP BY g.G_ID';
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Retrieves the games associated with the given user ID, excluding a specific user.
 *
 * @param U_ID        The user ID.
 * @param other_user  The ID of the user to be excluded.
 * @return A Promise that resolves to the list of games.
 */
let getGamesWithoutUser = (U_ID, other_user) =>
	new Promise((resolve, reject) => {
		// const sql = 'SELECT * FROM `game` AS g LEFT JOIN user_game AS ug ON g.G_ID = ug.G_ID  WHERE `creator` = ' + db.escape(U_ID) + ' AND `U_ID` <> ' + db.escape(other_user) + '  GROUP BY g.G_ID';
		// const sql = 'SELECT g.*, IFNULL(COUNT(ug.G_ID), 0) AS current_members FROM `game` AS g LEFT JOIN user_game AS ug ON g.G_ID = ug.G_ID AND ug.U_ID = ' + db.escape(other_user) + ' WHERE g.creator = ' + db.escape(U_ID) + ' AND ug.U_ID IS NULL AND g.stage = ' + db.escape('paused') + ';';
		// This is already way to complicated to fix. I'm sorry.
		const sql = 'SELECT g.*, IFNULL(ug.current_members, 0) AS current_members FROM ( SELECT g.G_ID, COUNT(ug.G_ID) AS current_members FROM `game` AS g LEFT JOIN user_game AS ug ON g.G_ID = ug.G_ID AND ug.U_ID = ' + db.escape(other_user) + ' WHERE g.creator = ' + db.escape(U_ID) + ' AND ug.U_ID IS NULL AND g.stage = ' + db.escape('paused') + ' GROUP BY g.G_ID ) AS ug JOIN `game` AS g ON ug.G_ID = g.G_ID WHERE ug.current_members < g.max_members;';
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Joins a user to a game.
 *
 * @param U_ID The user ID.
 * @param G_ID The game ID.
 * @return A Promise that resolves when the user joins the game.
 */
let joinGame = (U_ID, G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'INSERT INTO `user_game`(`U_ID`, `G_ID`) VALUES (?, ?)';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Starts the game with the provided game ID.
 *
 * @param G_ID The game ID.
 * @return A Promise that resolves when the game is started.
 */
let startGame = (G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `game` SET `stage` = "running" WHERE `G_ID` = ?';
		db.query(sql, [G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Ends the game with the provided game ID.
 *
 * @param G_ID The game ID.
 * @return A Promise that resolves when the game is ended.
 */
let endGame = (G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `game` SET `stage` = "ended" WHERE `G_ID` = ' + G_ID;
		db.query(sql, [G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Assigns Santas to the members of the game.
 *
 * @param assignedMembers The list of assigned members and their Santas.
 * @param G_ID            The game ID.
 * @return A Promise that resolves when the Santas are assigned.
 */
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

/**
 * Restarts the game with the provided game ID and creator.
 *
 * @param G_ID    The game ID.
 * @param creator The creator of the game.
 * @return A Promise that resolves when the game is restarted.
 */
let restartGame = (G_ID, creator) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `game` SET `stage` = "paused" WHERE `G_ID` = ?; UPDATE `user_game` SET `recipient` = NULL WHERE `G_ID` = ?; ';
		db.query(sql, [G_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Updates the game with the provided game ID and data.
 *
 * @param gameId      The game ID.
 * @param updatedData The updated data for the game.
 * @return A Promise that resolves when the game is updated.
 */
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

/**
 * Deletes the game with the provided game ID and user ID.
 *
 * @param gameId The game ID.
 * @param U_ID   The user ID.
 * @return A Promise that resolves when the game is deleted.
 */
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

/**
 * Removes a user from a game.
 *
 * @param gameId The game ID.
 * @param userId The user ID.
 * @return A Promise that resolves when the user is removed.
 */
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

/**
 * Checks if the user with the given game ID and user ID is the admin of the game.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to a boolean indicating if the user is the admin.
 */
let checkAdmin = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `game` WHERE `G_ID` = ? AND `creator` = ?';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results.length > 0);
		});
	});

/**
 * Checks if the user with the given game ID and user ID is a member of the game.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to a boolean indicating if the user is a member.
 */
let checkMember = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user_game` WHERE `G_ID` = ? AND `U_ID` = ?';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results.length > 0);
		});
	});

/**
 * Deletes all chats associated with the given game ID.
 *
 * @param G_ID The game ID.
 * @return A Promise that resolves when the chats are deleted.
 */
let deleteAllChats = (G_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'DELETE FROM `chat` WHERE `game` = ' + G_ID;
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Creates chats for the members of the game with the provided game ID.
 *
 * @param members The list of members and their assignments.
 * @param G_ID    The game ID.
 * @return A Promise that resolves when the chats are created.
 */
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

/**
 * Retrieves the messages sent by Santa to the user with the given game ID and user ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to the list of messages.
 */
let chatSanta = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM message AS m LEFT JOIN chat AS c ON m.chat = c.C_ID WHERE c.game = ? AND c.user_receiver = ? ORDER BY m.timestamp DESC';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Retrieves the chat ID for the chat between Santa and the user with the given game ID and user ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to the chat ID.
 */
let chatSantaId = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT C_ID FROM chat WHERE user_receiver = ? AND game = ?';
		db.query(sql, [U_ID, G_ID], (error, results) => {
			if (error) reject(error);
			resolve(results[0].C_ID);
		});
	});

/**
 * Sends a message from the sender to the chat with the provided chat ID.
 *
 * @param chatId  The chat ID.
 * @param sender  The sender of the message.
 * @param message The message content.
 * @return A Promise that resolves when the message is sent.
 */
let sendMessage = (chatId, sender, message) =>
	new Promise((resolve, reject) => {
		const sql = 'INSERT INTO `message`(`chat`, `message_content`, `sender`) VALUES (?, ?, ?)';
		db.query(sql, [chatId, message, sender], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Retrieves the messages sent by the user to the recipient with the given game ID and user ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to the list of messages.
 */
let chatRecipient = (G_ID, U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM message AS m LEFT JOIN chat AS c ON m.chat = c.C_ID WHERE c.game = ? AND c.user_giver = ? ORDER BY m.timestamp DESC';
		db.query(sql, [G_ID, U_ID], (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

/**
 * Retrieves the chat ID for the chat between the user and the recipient with the given game ID and user ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to the chat ID.
 */
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

/**
 * Retrieves the recipient (user receiving gifts) for the user with the given game ID and user ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to the recipient.
 */
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

/**
 * Retrieves Santa (user giving gifts) for the user with the given game ID and user ID.
 *
 * @param G_ID The game ID.
 * @param U_ID The user ID.
 * @return A Promise that resolves to Santa.
 */
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
