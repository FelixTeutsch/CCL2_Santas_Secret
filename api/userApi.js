const { config } = require('../services/database');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../model/userModel');

// Create a new user
function createUser(req, res, next) {
	userModel
		.create(req.body)
		.then((result) => res.status(201).json({ message: 'User created successfully' }))
		.catch((error) => res.status(500).json({ error: 'Failed to create user', message: error }));
}

function getAllUsers(req, res, next) {
	userModel
		.getAll()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to fetch users', message: error });
		});
}

function getUser(req, res, next) {
	console.log('User requested: ', req.params.U_ID);
	userModel
		.get(req.params.U_ID)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ error: 'User not found' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to fetch user', message: error });
		});
}

function searchUser(req, res, next) {
	console.log('User requested: ', req.params.U_ID);
	userModel
		.search(req.params.U_ID)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ error: 'User not found' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to fetch user', message: error });
		});
}
function updateUser(req, res, next) {
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ error: 'Request body is empty' });
		return;
	}
	userModel
		.update(req.params.U_ID, req.body)
		.then((result) => {
			if (result.affectedRows === 0) {
				res.status(404).json({ error: 'User not found' });
			} else {
				res.status(200).json({ message: 'User updated successfully' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to update user', message: error });
		});
}

function checkUserCredentials(req, res, next) {
	if (Object.keys(req.body).length === 0 || !req.body.username || !req.body.password) {
		const fields = ['username', 'password'];
		res.status(400).json({ error: 'Request body is empty or necessary fields are missing', fields });
		return;
	}

	const { username, password } = req.body;

	userModel
		.checkCredentials(username, password)
		.then((user) => {
			if (user) {
				res.status(200).json({ message: 'Credentials are correct', user });
			} else {
				res.status(401).json({ error: 'Invalid credentials' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to check credentials', message: error });
		});
}

function deleteUser(req, res, next) {
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ error: 'Request body is empty' });
		return;
	}

	deleteUser(req.params.U_ID)
		.then((affectedRows) => {
			if (affectedRows === 0) {
				res.status(404).json({ error: 'User not found' });
			} else {
				res.status(200).json({ message: 'User deleted successfully' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to delete user', message: error });
		});
}

function availableUsername(req, res, next) {
	userModel
		.available(req.params.username)
		.then((availableUsers) => {
			res.status(200).json(availableUsers);
		})
		.catch((err) => res.status(500).json({ error: 'Failed to check username', message: error }));
}
module.exports = { createUser, getAllUsers, getUser, searchUser, updateUser, deleteUser, checkUserCredentials, availableUsername };
