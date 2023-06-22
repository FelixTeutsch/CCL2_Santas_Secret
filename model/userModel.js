const db = require('../services/database').config;
const { hashPassword } = require('../services/authentication');

let create = ({ username, first_name, last_name, password }) =>
	new Promise(async (resolve, reject) => {
		// User Searcher
		const request = 'INSERT INTO `user`(`username`, `first_name`, `last_name`, `password`) VALUES (?, ?, ?, ?);';

		const hashedPassword = await hashPassword(password);
		db.query(request, [username, first_name, last_name, hashedPassword], (err, res) => {
			if (err) reject(err);
			if (res && res.affectedRows > 0) resolve({ U_ID: res.insertId });
		});
	});

// Get all users that corelate to the search value
let search = (searchValue) =>
	new Promise((resolve, reject) => {
		searchValue = '%' + searchValue + '%';
		const sql = 'SELECT * FROM `user` WHERE `U_ID` = ? OR `username` LIKE ? OR first_name LIKE ? OR last_name LIKE ?';
		const values = [searchValue, searchValue, searchValue, searchValue];

		db.query(sql, values, (error, results) => {
			if (error) reject(error);
			resolve(results);
		});
	});

// Get all users that corelate to the search value
let get = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE `U_ID` = ' + db.escape(U_ID) + ' OR username = ' + db.escape(U_ID);
		db.query(sql, (error, results) => {
			if (error) reject(error);
			resolve(results[0]);
		});
	});

// Get all users
let getAll = () =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user`';

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
const update = (U_ID, { username, first_name, last_name }) =>
	new Promise((resolve, reject) => {
		const sql = 'UPDATE `user` SET';
		const values = [];
		const updateFields = [];

		if (username) updateFields.push('`username` = ?') && values.push(username);
		if (first_name) updateFields.push('`first_name` = ?') && values.push(first_name);
		if (last_name) updateFields.push('`last_name` = ?') && values.push(last_name);

		if (updateFields.length === 0) {
			resolve(null); // No fields to update
			return;
		}

		const updateQuery = `${sql} ${updateFields.join(', ')} WHERE \`U_ID\` = ?`;
		values.push(U_ID);

		db.query(updateQuery, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
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
			resolve(results.length < 1);
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
	updatePassword,
	available,
};
