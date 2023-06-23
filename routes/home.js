const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController.js');

/**
 * Route for viewing the home page.
 * HTTP Method: GET
 * Endpoint: /
 */
router.get('/', homeController.viewHome);

module.exports = router;
