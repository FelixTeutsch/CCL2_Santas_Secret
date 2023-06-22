const express = require('express');
const router = express.Router();
const userApi = require('../api/userApi');
const searchApi = require('../api/searchApi');
const messageApi = require('../api/messageApi');

// Get all users
router.all('/user', userApi.getAllUsers);

// Create a new user
router.post('/user/create', userApi.createUser);

// Check user credentials
router.post('/user/check', userApi.checkUserCredentials);

// Get a specific user
router.all('/user/get/:U_ID', userApi.getUser);

// Search users -> Get list of matches
router.all('/user/search/:U_ID', userApi.searchUser);

// Update a user
router.all('/user/update/:U_ID', userApi.updateUser);

// Delete a user
router.all('/user/delete/:U_ID', userApi.deleteUser);

router.all('/user/available/:username', userApi.availableUsername);

router.all('/search/user', searchApi.searchUser);
router.all('/search/game', searchApi.searchGame);

router.post('/message/send', messageApi.sendMessage);

module.exports = router;
