const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Profile route
router.all('/', userController.viewProfile);

// Edit profile route
router
	.route('/edit')
	/**
	 * Render the profile editing form.
	 * HTTP Method: GET
	 * Endpoint: /profile/edit
	 */
	.get(userController.edit)
	/**
	 * Handle profile update.
	 * HTTP Method: POST
	 * Endpoint: /profile/edit
	 */
	.post(userController.updateProfile);

// Delete profile route
router
	.route('/delete')
	/**
	 * Handle profile deletion.
	 * HTTP Method: POST
	 * Endpoint: /profile/delete
	 */
	.post(userController.deleteProfile);

// Picture route
router
	.route('/picture')
	/**
	 * Render the profile picture changing form.
	 * HTTP Method: GET
	 * Endpoint: /profile/picture
	 */
	.get(userController.changePicture)
	/**
	 * Handle profile picture update.
	 * HTTP Method: POST
	 * Endpoint: /profile/picture
	 */
	.post(userController.updatePicture);

// View profile route
router
	.route('/view/:id')
	/**
	 * View another user's profile.
	 * HTTP Method: GET
	 * Endpoint: /profile/view/:id
	 * @param {string} id - The user ID.
	 */
	.get(userController.viewProfile)
	/**
	 * Add another user to a game.
	 * HTTP Method: POST
	 * Endpoint: /profile/view/:id
	 * @param {string} id - The user ID.
	 */
	.post(userController.addToGame);

module.exports = router;
