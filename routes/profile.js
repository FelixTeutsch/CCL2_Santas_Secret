const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// TODO: Implement General Profile View
router.all('/', userController.viewProfile);

// TODO: Implement Edit View & Logic
router.all('/edit', (req, res, next) => res.render('edit'));
// TODO: Render Profile, Make sure Profile is not Hidden & Implement Logic
// The rendered profile is not of the user himself, but if he is viewing someone elses profile
router.all('/view/:id', userController.viewProfile);

module.exports = router;
