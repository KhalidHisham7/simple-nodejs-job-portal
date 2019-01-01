const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email'
    ]
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        // Successful authentication, redirect dashboard.
        res.redirect('/dashboard');
    });

router.get('/verify', (req, res) => {
    if (req.user) {
        console.log(req.user);
    } else {
        console.log('not authorized');
    }
});

router.get('/login', ensureGuest, (req, res) => {
    res.render('auth/login', { layout: 'auth' });
});

router.get('/register', ensureGuest, (req, res) => {
    res.render('auth/register', { layout: 'auth' });
});

router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('auth/register', {
            layout: 'auth',
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        res.send('passed');
    }
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});
module.exports = router;