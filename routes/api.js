const express = require('express');
const router = express.Router();
const userApi = require('../api/userApi');
const searchApi = require('../api/searchApi');
const messageApi = require('../api/messageApi');

/**
 * API route for getting all users.
 * HTTP Method: ALL
 * Endpoint: /api/user
 */
router.all('/user', userApi.getAllUsers);

/**
 * API route for creating a new user.
 * HTTP Method: POST
 * Endpoint: /api/user/create
 */
router.post('/user/create', userApi.createUser);

/**
 * API route for checking user credentials.
 * HTTP Method: POST
 * Endpoint: /api/user/check
 */
router.post('/user/check', userApi.checkUserCredentials);

/**
 * API route for getting a specific user.
 * HTTP Method: ALL
 * Endpoint: /api/user/get/:U_ID
 * @param {string} U_ID - The user ID.
 */
router.all('/user/get/:U_ID', userApi.getUser);

/**
 * API route for searching users and getting a list of matches.
 * HTTP Method: ALL
 * Endpoint: /api/user/search/:U_ID
 * @param {string} U_ID - The user ID.
 */
router.all('/user/search/:U_ID', userApi.searchUser);

/**
 * API route for updating a user.
 * HTTP Method: ALL
 * Endpoint: /api/user/update/:U_ID
 * @param {string} U_ID - The user ID.
 */
router.all('/user/update/:U_ID', userApi.updateUser);

/**
 * API route for deleting a user.
 * HTTP Method: ALL
 * Endpoint: /api/user/delete/:U_ID
 * @param {string} U_ID - The user ID.
 */
router.all('/user/delete/:U_ID', userApi.deleteUser);

/**
 * API route for checking username availability.
 * HTTP Method: ALL
 * Endpoint: /api/user/available/:username
 * @param {string} username - The username to check.
 */
router.all('/user/available/:username', userApi.availableUsername);

/**
 * API route for searching users.
 * HTTP Method: ALL
 * Endpoint: /api/search/user
 */
router.all('/search/user', searchApi.searchUser);

/**
 * API route for searching games.
 * HTTP Method: ALL
 * Endpoint: /api/search/game
 */
router.all('/search/game', searchApi.searchGame);

/**
 * API route for sending a message.
 * HTTP Method: POST
 * Endpoint: /api/message/send
 */
router.post('/message/send', messageApi.sendMessage);

module.exports = router;
