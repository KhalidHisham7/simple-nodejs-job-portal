const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Job = mongoose.model('jobs');
const User = mongoose.model('users');


router.get('/', (req, res) => {
    Job.find({ acceptApplications: true })
        .populate('employer')
        .then(jobs => {
            res.render('jobs/index', {
                jobs: jobs
            });
        });
});

router.get('/show/:id', (req, res) => {
    Job.findOne({
            _id: req.params.id
        })
        .populate('employer')
        .then(job => {
            res.render('jobs/show', {
                job: job
            });
        })
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('jobs/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Job.findOne({
            _id: req.params.id
        })
        .then(job => {
            res.render('jobs/edit', {
                job: job
            });
        });

});

router.put('/:id', (req, res) => {
    Job.findOne({
            _id: req.params.id
        })
        .then(job => {
            let acceptApplications;

            if (req.body.acceptApplications) {
                acceptApplications = true;
            } else {
                acceptApplications = false;
            }

            job.title = req.body.title;
            job.description = req.body.description;
            job.acceptApplications = acceptApplications;

            job.save()
                .then(job => {
                    res.redirect('/dashboard');
                });
        });
});

router.delete('/:id', (req, res) => {
    Job.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/dashboard');
        });
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