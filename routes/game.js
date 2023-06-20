const express = require('express');
const router = express.Router();
const gameController = require('../controller/gameController');

router.get('/', (req, res, next) => res.redirect('/home'));

router
	.route('/create')
	.get((req, res, next) => res.render('game/create'))
	.post(gameController.createGame);

router.route('/:id').get(gameController.getGame).put(gameController.updateGame).patch(gameController.updateGame).delete(gameController.deleteGame);

router.route('/:id/join').all(gameController.joinGame);

router.all('/:id/chat', (req, res, next) => res.render('chat'));
router.all('/:id/settings', (req, res, next) => res.render('settings'));
router.all('/:id/share', (req, res, next) => res.render('share'));
router.all('/:id/add', (req, res, next) => res.render('add'));

module.exports = router;
