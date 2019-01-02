const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Job = mongoose.model('jobs');
const User = mongoose.model('users');
var multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/cvs')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + '-' + Date.now() + '.pdf')
    }
});
var uploadCv = multer({ dest: 'public/uploads/cvs', storage: storage });


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
        .populate('applications')
        .then(job => {
            res.render('jobs/show', {
                job: job,
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

router.get('/application/:id', ensureAuthenticated, (req, res) => {
    res.render('jobs/application', {
        id: req.params.id
    });
});

router.get('/:id/applications', ensureAuthenticated, (req, res) => {
    Job.findOne({
            _id: req.params.id
        })
        .then(job => {
            const applications = job.applications;
            res.render('jobs/applications', {
                applications: applications
            });
        })
});

router.post('/application/:id', ensureAuthenticated, uploadCv.single('cv'), (req, res) => {
    Job.findOne({ _id: req.params.id })
        .then(job => {
            if (job) {
                job.applications.push({
                    applicant: req.user.id,
                    name: req.user.firstName,
                    cv: {
                        path: req.file.path.slice(7),
                        size: req.file.size,
                    },
                });
                job.save().then(job => {
                    res.redirect('/jobs/show/' + req.params.id);
                })
            }
        }).catch(err => {
            console.log(err);
            req.flash('error', 'Something Wrong Happened');
            res.redirect('/jobs/show/' + req.params.id);
        })
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
        employer: {
            _id: req.user.id,
            name: req.user.firstName,
            email: req.user.email,
        }
    }

    new Job(newJob)
        .save()
        .then(job => {
            res.redirect(`/jobs/show/${job.id}`);
        })
});

module.exports = router;