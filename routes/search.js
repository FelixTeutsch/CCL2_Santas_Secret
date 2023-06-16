const express = require('express');
const router = express.Router();
const searchController = require('../controller/searchController');
const api = require('../api/searchApi');

// TODO: implement search view
router.route('/').get(searchController.searchPage).post(api.search);

// TODO: implement search result
router.all('/:result', (req, res, next) => res.render('searchResult'));

module.exports = router;
