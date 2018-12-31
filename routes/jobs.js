const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', (req, res) => {
    res.render('jobs/index');
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('jobs/add');
});

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('jobs/edit');
});

module.exports = router;