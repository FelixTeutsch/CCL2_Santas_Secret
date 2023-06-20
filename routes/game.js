const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

// TODO: Implement All games View
router.all('/', (req, res, next) => res.redirect('/home'));

router
	.route('/create')
	.get((req, res, next) => res.render('game/create'))
	.post(gameController.createGame);

// TODO: Render game, Make sure game is not Hidden & Implement Logic
router.all('/:uuid', (req, res, next) => res.render('game/game'));

// TODO: Implement game Chat View & Logic
router.all('/:uuid/chat', (req, res, next) => res.render('chat'));

// TODO: Implement Settings View & Logic
router.all('/:uuid/settings', (req, res, next) => res.render('settings'));

// TODO: Implement share View & Logic
router.all('/:uuid/share', (req, res, next) => res.render('share'));

// TODO: Implement add View & Logic
router.all('/:uuid/add', (req, res, next) => res.render('add'));

module.exports = router;
