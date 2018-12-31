const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

const User = mongoose.model('users');

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            // console.log(accessToken);
            // console.log(profile);
            const img = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: img
            }

            // Check for existing user
            User.findOne({
                googleID: profile.id
            }).then(user => {
                if (user) {
                    // Returning found user, First parameter is null because its the error parameter which we don't happen to have here
                    done(null, user);
                } else {
                    //Create user
                    new User(newUser)
                        .save()
                        .then(user => done(null, user));
                }
            })
        })
    )
}