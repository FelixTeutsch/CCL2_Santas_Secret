const express = require('express');
const router = express.Router();
const api = require('../api/searchApi');

// Search route
router
	.route('/')
	/**
	 * Render the search view.
	 * TODO: Implement the search view.
	 * HTTP Method: All
	 * Endpoint: /search
	 */
	.all((req, res, next) => res.render('search'));

// Search result route
// TODO: Implement search result
// router.all('/:result', (req, res, next) => res.render('searchResult'));

module.exports = router;
