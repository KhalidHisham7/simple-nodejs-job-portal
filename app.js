const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Loading user model
require('./models/User');
require('./models/Job');
require('./models/Exam');

// Routes loading
const index = require('./routes/index');
const auth = require('./routes/auth');
const jobs = require('./routes/jobs');
const exams = require('./routes/exams');

// Load keys
const keys = require('./config/keys');

// handlebars helpers
const {
    truncate
} = require('./helpers/hbs');

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
    helpers: {
        truncate: truncate,
        equals: function(val1, val2) {
            return val1 == val2;
        },
        not: function(val) {
            return !val;
        }
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Method overridemiddleware
app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport config
require('./config/passport')(passport);

// Setting global varibales
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.error = req.flash('error');
    next();
});

// Setting static folder
app.use(express.static(path.join(__dirname, 'public')));

// Using routes
app.use('/', index);
app.use('/auth', auth);
app.use('/jobs', jobs);
app.use('/exams', exams);

const port = 5000;

app.listen(5000, () => {
    console.log(`Server started on port ${port}`);
});