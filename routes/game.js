const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

router.get('/', (req, res, next) => res.redirect('/home'));

router
	.route('/create')
	.get((req, res, next) => res.render('game/create'))
	.post(gameController.createGame);

router.route('/:id').get(gameController.getGame).put(gameController.updateGame).patch(gameController.updateGame).delete(gameController.deleteGame);

router.route('/:id/join').all(gameController.joinGame);
router.route('/:id/info').all(gameController.infoGame);

// Middleware to extract the game ID
const extractGameId = (req, res, next) => {
	req.gameId = req.params.id; // Store the game ID in the request object
	next();
};

// Middleware to check if the user is a member
router.use('/:id', extractGameId, gameController.isMember);

router.all('/:id/chatRecipient', gameController.chatRecipient);
router.all('/:id/chatSanta', gameController.chatSanta);
router.route('/:id/leave').all(gameController.leaveGame);

router.use(gameController.isAdmin);
router.route('/:id/start').all(gameController.startGame);
router.route('/:id/end').all(gameController.endGame);
router.route('/:id/restart').all(gameController.restartGame);
router.route('/:id/edit').get(gameController.editGame).post(gameController.updateGame);
router.all('/:id/delete', gameController.deleteGame);
router.all('/:id/kick/:U_ID', gameController.kickPlayer);

// router.all('/:id/share', (req, res, next) => res.render('share'));
// router.all('/:id/add', (req, res, next) => res.render('add'));

module.exports = router;
