const gameModel = require('../model/gameModel');
const fs = require('fs');
const path = require('path');

function editGame(req, res, next) {
	gameModel.get(req.params.id).then((result) => {
		if (result.creator === req.user.id) {
			const iconsDirectory = path.join(__dirname, '..', 'public', 'images', 'icons');
			fs.readdir(iconsDirectory, (err, files) => {
				if (err) {
					console.error('Failed to read icons directory:', err);
					res.status(500).json({ error: 'Failed to retrieve icons' });
				} else {
					const icons = files.filter((file) => path.extname(file) === '.svg').map((file) => path.basename(file, '.svg'));
					res.render('game/edit', { game: result, icons });
				}
			});
		} else {
			res.status(403).json({ error: 'Forbidden' });
		}
	});
}

function createGame(req, res, next) {
	gameModel
		.create(req.body, req.user.id)
		.then((result) => {
			gameModel.joinGame(req.user.id, result.G_ID);
			res.redirect('/game/' + result.G_ID);
		})
		.catch((error) => res.status(500).json({ error: 'Failed to create game', message: error }));
}

function getGame(req, res, next) {
	const game = gameModel.get(req.params.id);
	const members = gameModel.getMembers(req.params.id);
	Promise.all([game, members])
		.then((result) => {
			if (result[0].stage !== 'paused') {
				console.log('game is not paused');
				const yourSanta = gameModel.getYourSanta(req.params.id, req.user.id);
				const yourTarget = gameModel.getYourTarget(req.params.id, req.user.id);
				Promise.all([yourSanta, yourTarget])
					.then((res2) => {
						res.render('game/game', { game: result[0], user: req.user, members: result[1], santa: res2[0][0], target: res2[1][0] });
					})
					.catch((error) => res.status(500).json({ error: 'Some error with the santas...', message: error }));
			} else {
				res.render('game/game', { game: result[0], user: req.user, members: result[1] });
			}
		})
		.catch((error) => res.status(500).json({ error: 'Failed to get game', message: error }));
}

function joinGame(req, res, next) {
	console.log(req.params.id, req.user.id);
	// TODO: check if game is running!
	const isRunning = gameModel.get(req.params.id);
	const getMembers = gameModel.getMembers(req.params.id);
	Promise.all([isRunning, getMembers])
		.then((result) => {
			console.log(result[0].stage, result[1].length, result[0].max_members);
			if (result[0].stage === 'paused' && result[1].length < result[0].max_members) {
				gameModel
					.joinGame(req.user.id, req.params.id)
					.then((temp) => {
						console.log('joined game');
						res.redirect('/game/' + req.params.id);
					})
					.catch((error) => res.status(500).json({ error: 'Failed to join game', message: error }));
			} else {
				res.status(500).json({ error: 'Failed to join game', message: 'Game is running or full' });
			}
		})
		.catch((error) => res.status(500).json({ error: 'Failed to join game', message: error }));
}

function updateGame(req, res, next) {
	gameModel
		.update(req.params.id, req.body)
		.then((result) => {
			res.redirect('/game/' + req.params.id);
		})
		.catch((error) => res.status(500).json({ error: 'Failed to update game', message: error }));
}

function deleteGame(req, res, next) {
	gameModel
		.delete(req.params.id)
		.then((result) => {
			res.json({ message: 'Game deleted successfully' });
		})
		.catch((error) => res.status(500).json({ error: 'Failed to delete game', message: error }));
}

function infoGame(req, res, next) {
	const game = gameModel.get(req.params.id);
	const members = gameModel.getMembers(req.params.id);

	Promise.all([game, members])
		.then((result) => {
			res.render('game/info', { game: result[0], user: req.user, members: result[1] });
		})
		.catch((error) => res.status(500).json({ error: 'Failed to get game', message: error }));
}

function startGame(req, res, next) {
	console.log(req.params.id);
	// Get Game Members
	const members = gameModel.getMembers(req.params.id);

	Promise.all([members]).then((result) => {
		// Check if Game Members >= 2
		if (result[0].length < 2) {
			res.status(500).json({ error: 'Failed to start game', message: 'Not enough members' });
			return;
		}

		const assignedMembers = [];
		const memberList = result[0].map((member) => member.U_ID);

		while (memberList.length > 0) {
			const randomIndex = Math.floor(Math.random() * memberList.length);
			const selectedMember = memberList[randomIndex];
			memberList.splice(randomIndex, 1);
			const assignedMember = {
				member: selectedMember,
				assigned: null,
			};
			assignedMembers.push(assignedMember);
		}

		// Assign the last member to the first one
		assignedMembers[assignedMembers.length - 1].assigned = assignedMembers[0].member;

		// Assign each member to the next one
		for (let i = 0; i < assignedMembers.length - 1; i++) {
			assignedMembers[i].assigned = assignedMembers[i + 1].member;
		}

		console.log('Assigned Members');

		// TODO: delete all chats

		Promise.all([gameModel.deleteAllChats(req.params.id), gameModel.assignSantas(assignedMembers, req.params.id), gameModel.createChats(assignedMembers, req.params.id), gameModel.startGame(req.params.id)]).then((result) => {
			console.log(result);
			res.redirect('/game/' + req.params.id);
		});
	});

	// TODO: Get Number of Circles
	// TODO: If Number of Circles > Game Members -> Make groups of 2
	// TODO: If number of circles = 0 -> Make one big group
	// TODO: Else split members into groups of "Number of Circles"

	// TODO: Assign each member a different member in the same group
	// TODO: Save the assigned member in the database
	// TODO: Send each member a message with the assigned member
	// gameModel
	// 	.startGame(req.params.id)
	// 	.then((result) => {
	// 		console.log(result);
	// 		res.redirect('/game/' + req.params.id);
	// 	})
	// 	.catch((error) => res.status(500).json({ error: 'Failed to start game', message: error }));
}

function endGame(req, res, next) {
	console.log(req.params.id);
	gameModel.endGame(req.params.id).then((result) => {
		console.log(result);
		res.redirect('/game/' + req.params.id);
	});
}

function restartGame(req, res, next) {
	console.log(req.params.id);
	gameModel.restartGame(req.params.id).then((result) => {
		console.log(result);
		res.redirect('/game/' + req.params.id);
	});
}

function isAdmin(req, res, next) {
	console.log('Checking Admin Right:', req.user.id, 'for game', req.gameId);
	gameModel
		.checkAdmin(req.gameId, req.user.id)
		.then((result) => {
			console.log('Admin Right:', result);
			if (result) {
				next();
			} else {
				console.log('Not Admin, redirecting to game:', req.gameId);
				res.redirect('/game/' + req.gameId);
			}
		})
		.catch((error) => res.status(500).json({ error: 'Failed to check admin right', message: error }));
}

function chatSanta(req, res, next) {
	// TODO: check if game is running or has ended
	// TODO: if ended: show all names & icons
	console.log(req.params.id);
	Promise.all([gameModel.chatSanta(req.params.id, req.user.id), gameModel.chatSantaId(req.params.id, req.user.id), gameModel.getSanta(req.params.id, req.user.id)]).then((result) => {
		res.render('game/chat', { showThem: false, santa: true, messages: result[0], user: req.user, chatId: result[1], chatPartner: result[2] });
	});
}

function chatRecipient(req, res, next) {
	console.log(req.params.id);
	Promise.all([gameModel.chatRecipient(req.params.id, req.user.id), gameModel.chatRecipientId(req.params.id, req.user.id), gameModel.getRecipient(req.params.id, req.user.id)]).then((result) => {
		res.render('game/chat', { showThem: true, santa: false, messages: result[0], user: req.user, chatId: result[1], chatPartner: result[2] });
	});
}

function isMember(req, res, next) {
	console.log('Checking if member:', req.user.id, 'for game', req.gameId);
	gameModel
		.checkMember(req.gameId, req.user.id)
		.then((result) => {
			console.log('Is member:', result);
			if (result) {
				next();
			} else {
				console.log('Not Member, redirecting to game:', req.gameId);
				res.redirect('/game/' + req.gameId);
			}
		})
		.catch((error) => res.status(500).json({ error: 'Failed to check member right', message: error }));
}

function leaveGame(req, res, next) {
	console.log('Leaving game:', req.gameId, 'for user', req.user.id);
	gameModel.get(req.gameId).then((result) => {
		console.log('Game:', result);
		if (result.stage == 'paused') {
			gameModel.remove(req.gameId, req.user.id).then((result) => {
				console.log('Left game:', result);
				res.redirect('/game/' + req.gameId);
			});
		} else {
			console.log("Can't leave running game:", req.gameId);
			res.redirect('/game/' + req.gameId);
		}
	});
}

function deleteGame(req, res, next) {
	console.log('Deleting game:', req.gameId, 'for user', req.user.id);
	gameModel
		.deleteGame(req.gameId, req.user.id)
		.then((result) => {
			console.log('Deleted game:', result);
			res.redirect('/home');
		})
		.catch((err) => res.redirect('/game/' + req.gameId));
}

function kickPlayer(req, res, next) {
	console.log('Kicking player:', req.params.U_ID, 'from game', req.gameId);
	gameModel.remove(req.gameId, req.params.U_ID).then((result) => {
		console.log('Kicked player:', result);
		res.redirect('/game/' + req.gameId + '/info');
	});
}

module.exports = {
	createGame,
	getGame,
	updateGame,
	deleteGame,
	joinGame,
	infoGame,
	startGame,
	endGame,
	restartGame,
	isAdmin,
	chatSanta,
	isMember,
	chatRecipient,
	leaveGame,
	deleteGame,
	editGame,
	kickPlayer,
};
