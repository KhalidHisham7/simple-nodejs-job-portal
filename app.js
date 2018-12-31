const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

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

// Using routes
app.use('/auth', auth);

const port = 5000;

app.listen(5000, () => {
    console.log(`Server started on port ${port}`);
});