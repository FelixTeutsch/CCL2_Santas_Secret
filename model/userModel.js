const db = require('../services/database').config;
const { hashPassword } = require('../services/authentication');

let create = ({ username, first_name, last_name, password }) =>
	new Promise(async (resolve, reject) => {
		// User Search
		const request = 'INSERT INTO `user`(`U_ID`, `username`, `first_name`, `last_name`, `password`) VALUES (uuid(), ?, ?, ?, ?)';
		console.log('Request:', request);
		const hashedPassword = await hashPassword(password);
		db.query(request, [username, first_name, last_name, hashedPassword], (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});

// Get all users that corelate to the search value
let search = (searchValue) =>
	new Promise((resolve, reject) => {
		searchValue = '%' + searchValue + '%';
		const sql = 'SELECT * FROM `user` WHERE `U_ID` = ? OR `username` LIKE ? OR first_name LIKE ? OR last_name LIKE ?';
		const values = [searchValue, searchValue, searchValue, searchValue];

		db.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});

// Get all users that corelate to the search value
let get = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE `U_ID` = ? ';

		db.query(sql, U_ID, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});

// Get all users
let getAll = () =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE visibility = "Visible"';

		db.query(sql, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});

let checkCredentials = (username, password) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE `username` = ?';
		const values = [username];

		db.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				const user = results[0];
				if (user) {
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) {
							reject(err);
						} else if (isMatch) {
							resolve(user);
						} else {
							resolve(null);
						}
					});
				} else {
					resolve(null);
				}
			}
		});
	});

// Update a user
let update = (U_ID, { username, first_name, last_name, visibility }) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `user` SET `username` = ?, `first_name` = ?, `last_name` = ?, `visibility` = ? WHERE `U_ID` = ?';
		const values = [username, first_name, last_name, visibility, U_ID];

		db.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results.affectedRows);
			}
		});
	});

let updatePassword = (U_ID, password) =>
	new Promise(async (resolve, reject) => {
		password = await hashPassword(password);
		const request = 'UPDATE user SET password = ' + db.escape(password) + ' WHERE U_ID = ' + db.escape(U_ID);
		db.query(request, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

// Delete a user
let deleteUser = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'DELETE FROM `user` WHERE `U_ID` = ?';
		const values = [U_ID];

		db.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results.affectedRows);
			}
		});
	});

let available = (username) =>
	new Promise((resolve, reject) => {
		const request = 'SELECT * FROM user WHERE username = ' + db.escape(username);
		db.query(request, (error, results) => {
			if (error) reject(error);
			resolve(results.affectedRows > 0);
		});
	});

module.exports = {
	create,
	get,
	search,
	getAll,
	checkCredentials,
	update,
	deleteUser,
};
