const express = require('express');
const router = express.Router();

// TODO: Implement All Groups View
router.all('/', (req, res, next) => res.render('allGroups'));

// TODO: Render Group, Make sure group is not Hidden & Implement Logic
router.all('/:uuid', (req, res, next) => res.render('group'));

// TODO: Implement Group Chat View & Logic
router.all('/:uuid/chat', (req, res, next) => res.render('chat'));

// TODO: Implement Settings View & Logic
router.all('/:uuid/settings', (req, res, next) => res.render('settings'));

// TODO: Implement share View & Logic
router.all('/:uuid/share', (req, res, next) => res.render('share'));

// TODO: Implement add View & Logic
router.all('/:uuid/add', (req, res, next) => res.render('add'));

module.exports = router;
