const gameModel = require('../model/gameModel.js');

/**
 * Sends a message in a game.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
function sendMessage(req, res, next) {
	console.log(req.body);
	gameModel.sendMessage(req.body.gameId, req.user.id, req.body.message).then((result) => {
		console.log(result);
		res.status(200).json({ message: 'Message sent' });
	});
}

module.exports = {
	sendMessage,
};
