const express = require('express');
const router = express.Router();

// TODO: implement search view
router.all('/', (req, res, next) => res.render('search'));

// TODO: implement search result
router.all('/:result', (req, res, next) => res.render('searchResult'));

module.exports = router;
