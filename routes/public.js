/**
 * Express router for serving static files.
 * @module routes/staticFiles
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * Checks if a file exists.
 * @param {string} filePath - The path of the file to check.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the file exists, `false` otherwise.
 */
function fileExists(filePath) {
	return new Promise((resolve) => {
		fs.access(filePath, fs.constants.F_OK, (err) => {
			resolve(!err);
		});
	});
}

/**
 * Handles requests to the root path.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
router.all('/', (req, res, next) => {
	const message = 'Please use one of the following resources';
	const routes = ['/public/images', '/public/javascripts', '/public/stylesheets'];
	res.status(400).json({ message, routes });
});

/**
 * Handles requests for image files.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
router.all('/images/:image', async (req, res, next) => {
	const imagePath = path.join(__dirname, '../public/images', req.params.image);
	const exists = await fileExists(imagePath);

	if (exists) {
		res.sendFile(imagePath);
	} else {
		const defaultImagePath = path.join(__dirname, '../public/images/default.jpg');
		res.sendFile(defaultImagePath);
	}
});

/**
 * Handles requests for JavaScript files.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
router.all('/javascripts/:image', async (req, res, next) => {
	const javascriptPath = path.join(__dirname, '../public/javascripts', req.params.image);
	const exists = await fileExists(javascriptPath);

	if (exists) {
		res.sendFile(javascriptPath);
	} else {
		res.status(404).send('File not found');
	}
});

/**
 * Handles requests for stylesheet files.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
router.all('/stylesheets/:image', async (req, res, next) => {
	const stylesheetPath = path.join(__dirname, '../public/stylesheets', req.params.image);
	const exists = await fileExists(stylesheetPath);

	if (exists) {
		res.sendFile(stylesheetPath);
	} else {
		res.status(404).send('File not found');
	}
});

module.exports = router;
