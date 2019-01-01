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

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/');
});
module.exports = router;