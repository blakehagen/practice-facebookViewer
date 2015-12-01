var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: 'thisisasecret',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// FACEBOOK STRATEGY //
passport.use(new FacebookStrategy({
    clientID: '991918067535238',
    clientSecret: '41cc9fe52a3a581c0a08a96e763e38c9',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function (token, refreshToken, profile, done) {
    return done(null, profile);
}));

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (obj, done) {
    done(null, obj);
})

var requireAuth = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
};

// AUTH ENDPOINTS //
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/api/me',
    failureRedirect: '/api/login'
}));

// MY INFO ENDPOINT //
app.get('/api/me', requireAuth, function (req, res, next) {
    var currentLoggedInUser = req.user;
    res.send(currentLoggedInUser);
});

// PORT //
var port = 3000;

app.listen(port, function () {
    console.log('listening on port ' + port);
})