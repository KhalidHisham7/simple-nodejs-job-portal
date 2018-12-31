const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Loading user model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Routes loading
const auth = require('./routes/auth');

// Load keys
const keys = require('./config/keys');

// Connecting to database
mongoose.connect(keys.mongoURI, {
        useNewUrlParser: true
    })
    .then(() => {
        console.log('mongodb connected');
    })
    .catch(err => console.log(err));

const app = express();

app.get('/', (req, res) => {
    res.send('it works');
});

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Setting global varibales
app.use((req, res, next) => {
    res.locals.uesr = req.user || null;
    next();
});

// Using routes
app.use('/auth', auth);

const port = 5000;

app.listen(5000, () => {
    console.log(`Server started on port ${port}`);
});