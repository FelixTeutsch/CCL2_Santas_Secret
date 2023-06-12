const express = require('express');
const router = express.Router();
const { createUser, getAllUsers, findUser, getUser, updateUser, deleteUser, checkUserCredentials } = require('../api/userApi');

// User Requests

// Create a new user
router.post('/user', (req, res) => {
	createUser(req.body)
		.then(() => {
			res.status(201).json({ message: 'User created successfully' });
		})
		.catch((error) => {
			// console.error(error);
			res.status(500).json({ error: 'Failed to create user', errorDetails: error });
		});
});

// Get all users
router.get('/user', (req, res) => {
	getAllUsers()
		.then((users) => {
			res.status(200).json(users);
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to fetch users', errorDetails: error });
		});
});

// Check user credentials
router.post('/user/check', (req, res) => {
	if (Object.keys(req.body).length === 0 || !req.body.username || !req.body.password) {
		const fields = ['username', 'password'];
		res.status(400).json({ error: 'Request body is empty or necessary fields are missing', fields });
		return;
	}

	const { username, password } = req.body;

	checkUserCredentials(username, password)
		.then((user) => {
			if (user) {
				res.status(200).json({ message: 'Credentials are correct', user });
			} else {
				res.status(401).json({ error: 'Invalid credentials' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to check credentials', errorDetails: error });
		});
});

// Get a specific user
router.route('/user/:U_ID').get((req, res) => {
	getUser(req.params.U_ID)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ error: 'User not found' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to fetch user', errorDetails: error });
		});
});

// Search users and get all with same value
router.route('/user/:U_ID/search').get((req, res) => {
	findUser(req.params.U_ID)
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).json({ error: 'User not found' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to fetch user', errorDetails: error });
		});
});

// Update a user
router.all('/user/:U_ID/update', (req, res) => {
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ error: 'Request body is empty' });
		return;
	}
	updateUser(req.params.U_ID, req.body)
		.then((affectedRows) => {
			if (affectedRows === 0) {
				res.status(404).json({ error: 'User not found' });
			} else {
				res.status(200).json({ message: 'User updated successfully' });
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).json({ error: 'Failed to update user', errorDetails: error });
		});
});

// Delete a user
router.all('/user/:U_ID/delete', (req, res) => {
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
			res.status(500).json({ error: 'Failed to delete user', errorDetails: error });
		});
});

module.exports = router;
