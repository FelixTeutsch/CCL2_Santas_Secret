const db = require('../services/database').config;

let create = ({ game_name, member_count, number_of_circles, visibility }, creator) =>
	new Promise((resolve, reject) => {
		console.log(game_name, ' ->', member_count, ' ->', number_of_circles, ' ->', visibility, ' ->', creator);
		const request = ' SET @game_uuid = UUID(); INSERT INTO `game`(`G_ID`, `name`, `creator`, `max_members`, `visibility`) VALUES (@game_uuid, ?, ?, ?, ?); SELECT @game_uuid;';
		db.query(request, [game_name, creator, member_count, visibility], (err, res) => {
			if (err) reject(err);
			console.log(res);
			resolve(res);
		});
	});

module.exports = {
	create,
};
