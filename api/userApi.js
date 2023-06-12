const { config } = require('../services/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// Create a new user
let createUser = (userData) =>
	new Promise((resolve, reject) => {
		const { username, password, first_name, last_name, birthday, gender, visibility } = userData;
		const U_ID = uuidv4();

		bcrypt.hash(password, 10, (err, hashedPassword) => {
			if (err) {
				reject(err);
				return;
			}

			const sql = 'INSERT INTO `user` (`U_ID`, `username`, `password`, `first_name`, `last_name`, `birthday`, `gender`, `visibility`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
			const values = [U_ID, username, hashedPassword, first_name, last_name, birthday, gender, visibility];

			config.query(sql, values, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results);
				}
			});
		});
	});

// Get all users
let getAllUsers = () =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE visibility = "Visible"';

		config.query(sql, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});

// Get all users that corelate to the search value
let findUser = (searchValue) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE `visibility`= "Visible" AND (`U_ID` = ? OR `username` LIKE ?)';
		const values = [searchValue, `%${searchValue}%`];

		config.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results);
			}
		});
	});

// Get a specific user
let getUser = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE `U_ID` = ?';
		const values = [U_ID];

		config.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results[0]);
			}
		});
	});

// Update a user
let updateUser = (U_ID, userData) =>
	new Promise((resolve, reject) => {
		const { username, password, first_name, last_name, birthday, gender, visibility } = userData;

		bcrypt.hash(password, 10, (err, hashedPassword) => {
			if (err) {
				reject(err);
				return;
			}

			const sql = 'UPDATE `user` SET `username` = ?, `password` = ?, `first_name` = ?, `last_name` = ?, `birthday` = ?, `gender` = ?, `visibility` = ? WHERE `U_ID` = ?';
			const values = [username, hashedPassword, first_name, last_name, birthday, gender, visibility, U_ID];

			config.query(sql, values, (error, results) => {
				if (error) {
					reject(error);
				} else {
					resolve(results.affectedRows);
				}
			});
		});
	});

// Delete a user
let deleteUser = (U_ID) =>
	new Promise((resolve, reject) => {
		const sql = 'DELETE FROM `user` WHERE `U_ID` = ?';
		const values = [U_ID];

		config.query(sql, values, (error, results) => {
			if (error) {
				reject(error);
			} else {
				resolve(results.affectedRows);
			}
		});
	});

let checkUserCredentials = (username, password) =>
	new Promise((resolve, reject) => {
		const sql = 'SELECT * FROM `user` WHERE `username` = ?';
		const values = [username];

		config.query(sql, values, (error, results) => {
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

module.exports = { createUser, getAllUsers, findUser, getUser, updateUser, deleteUser, checkUserCredentials };
