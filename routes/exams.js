const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Exam = mongoose.model('exams');
const Job = mongoose.model('jobs');

router.get('/:applicant', ensureAuthenticated, (req, res) => {
    res.render('exams/create', {
        applicant: req.params.applicant
    });
});

router.post('/', ensureAuthenticated, (req, res) => {
    Job.find({})
        .then(jobs => {
            let job = jobs.applications;
            // job.applications.examAssigned = true;
            // job.save()
            //     .then(job => {
            //         console.log('finally');
            //     });
        });

    const newExam = {
        user: req.body.user,
        questions: [{
                body: req.body.question1,
                RA: req.body.ra1,
                WA1: req.body.wa11,
                WA2: req.body.wa21,
                WA3: req.body.wa31
            },
            {
                body: req.body.question2,
                RA: req.body.ra2,
                WA1: req.body.wa12,
                WA2: req.body.wa22,
                WA3: req.body.wa32
            },
            {
                body: req.body.question3,
                RA: req.body.ra3,
                WA1: req.body.wa13,
                WA2: req.body.wa23,
                WA3: req.body.wa33
            }
        ]
    }

    new Exam(newExam)
        .save()
        .then(exam => {
            res.redirect('/dashboard');
        })
});

module.exports = router;