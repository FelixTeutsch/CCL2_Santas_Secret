const express = require('express');
const router = express.Router();
const homeController = require('../controller/homeController.js');

router.get('/', homeController.viewHome);

module.exports = router;
