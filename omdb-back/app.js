const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const express = require('express');
const morgan = require('morgan');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;
const DB_CONNECT = require('./db');
const routes = require('./routes');

const app = express();

// MIDDLEWARES
app.use(cors({
    origin: 'http://127.0.0.1:3000',
    credentials: true                                 
}))

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('tiny'));


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie : { secure : false, maxAge : (4 * 60 * 60 * 1000) , httpOnly: false}    
}));

app.use(cookieParser('secret'))
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new localStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        function (email, password, done) {
        User.findOne({email})
            .then(user => {
                if(!user) done(null, false);
                bcrypt.compare(password, user.password)
                    .then(result => {
                        result ? done(null, user) : done(null, false);
                    })
            })
            .catch(done);
    })
);

passport.serializeUser(function(user, done) {
    console.log('ID', user.id)
    console.log('_ID', user._id)
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    console.log('FROM DESERIALIZE');
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch(done);
});

// ROUTE
app.use('/api', routes);

// ERR MIDDLEWARE
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.message);
});

//
const PORT = 3001;

DB_CONNECT();
app.listen(PORT, () => console.log(`API running on port: ${PORT}...`));