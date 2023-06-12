const express = require('express');
const router = express.Router();

// TODO: Implement General Profile View
router.all('/', (req, res, next) => res.render('profile'));

// TODO: Render Profile, Make sure Profile is not Hidden & Implement Logic
// The rendered profile is not of the user himself, but if he is viewing someone elses profile
router.all('/:uuid', (req, res, next) => res.render('Profile'));

// TODO: Implement Edit View & Logic
router.all('/edit', (req, res, next) => res.render('edit'));

module.exports = router;
