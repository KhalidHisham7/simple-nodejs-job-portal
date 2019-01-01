const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Loading user model
require('./models/User');

// Passport config
require('./config/passport')(passport);

// Routes loading
const index = require('./routes/index');
const auth = require('./routes/auth');
const jobs = require('./routes/jobs');

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

// Handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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
    res.locals.user = req.user || null;
    next();
});

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

// Using routes
app.use('/', index);
app.use('/auth', auth);
app.use('/jobs', jobs);

const port = 5000;

app.listen(5000, () => {
    console.log(`Server started on port ${port}`);
});