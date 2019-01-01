const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Job = mongoose.model('jobs');
const User = mongoose.model('users');


router.get('/', (req, res) => {
    res.render('jobs/index');
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('jobs/add');
});

router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('jobs/edit');
});

router.post('/', (req, res) => {
    let acceptApplications;

    if (req.body.acceptApplications) {
        acceptApplications = true;
    } else {
        acceptApplications = false;
    }

    const newJob = {
        title: req.body.title,
        description: req.body.description,
        acceptApplications: acceptApplications,
        employer: req.user.id
    }

    new Job(newJob)
        .save()
        .then(job => {
            res.redirect(`/jobs/show/${job.id}`);
        })
});

module.exports = router;