const gameModel = require('../model/gameModel.js');
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
