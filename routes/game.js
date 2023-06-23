const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

// Redirect to home page
router.get('/', (req, res, next) => res.redirect('/home'));

// Create game route
router
	.route('/create')
	/**
	 * Render the game creation form.
	 * HTTP Method: GET
	 * Endpoint: /game/create
	 */
	.get((req, res, next) => res.render('game/create'))
	/**
	 * Handle game creation.
	 * HTTP Method: POST
	 * Endpoint: /game/create
	 */
	.post(gameController.createGame);

// Game routes
router
	.route('/:id')
	/**
	 * Get game details.
	 * HTTP Method: GET
	 * Endpoint: /game/:id
	 * @param {string} id - The game ID.
	 */
	.get(gameController.getGame)
	/**
	 * Update game details.
	 * HTTP Method: PUT
	 * Endpoint: /game/:id
	 * @param {string} id - The game ID.
	 */
	.put(gameController.updateGame)
	/**
	 * Update game details (partial update).
	 * HTTP Method: PATCH
	 * Endpoint: /game/:id
	 * @param {string} id - The game ID.
	 */
	.patch(gameController.updateGame)
	/**
	 * Delete a game.
	 * HTTP Method: DELETE
	 * Endpoint: /game/:id
	 * @param {string} id - The game ID.
	 */
	.delete(gameController.deleteGame);

// Join game route
router.route('/:id/join').all(gameController.joinGame);

// Game info route
router.route('/:id/info').all(gameController.infoGame);

// Middleware to extract the game ID
const extractGameId = (req, res, next) => {
	req.gameId = req.params.id; // Store the game ID in the request object
	next();
};

// Middleware to check if the user is a member
router.use('/:id', extractGameId, gameController.isMember);

// Chat routes
router.all('/:id/chatRecipient', gameController.chatRecipient);
router.all('/:id/chatSanta', gameController.chatSanta);

// Leave game route
router.route('/:id/leave').all(gameController.leaveGame);

// Middleware to check if the user is an admin
router.use(gameController.isAdmin);

// Admin routes
router.route('/:id/start').all(gameController.startGame);
router.route('/:id/end').all(gameController.endGame);
router.route('/:id/restart').all(gameController.restartGame);
router.route('/:id/edit').get(gameController.editGame).post(gameController.updateGame);
router.all('/:id/delete', gameController.deleteGame);
router.all('/:id/kick/:U_ID', gameController.kickPlayer);

module.exports = router;
