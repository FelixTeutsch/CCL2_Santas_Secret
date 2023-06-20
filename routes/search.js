const express = require('express');
const router = express.Router();
const api = require('../api/searchApi');

// TODO: implement search view
router.route('/').all((req, res, next) => res.render('search'));

// TODO: implement search result
// router.all('/:result', (req, res, next) => res.render('searchResult'));

module.exports = router;
