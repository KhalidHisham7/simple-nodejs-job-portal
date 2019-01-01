const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Job = mongoose.model('jobs');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/', ensureGuest, (req, res) => {
    res.render('index/welcome');
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    Job.find({ employer: req.user.id })
        .then(jobs => {
            res.render('index/dashboard', {
                jobs: jobs
            });
        })
});

module.exports = router;