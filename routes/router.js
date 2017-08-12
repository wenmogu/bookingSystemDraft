const User = require('../models/user');
var limit = 1;
var bookingRoutes = require('./booking-routes');
var registrationRoutes = require('./registration-routes');
/*
> d.toString();
'Sat Aug 05 2017 16:57:06 GMT+0800 (Malay Peninsula Standard Time)'
> d.toLocaleDateString();
'8/5/2017'
> d.toLocaleString();
'8/5/2017, 4:57:06 PM'
> d.toDateString();
'Sat Aug 05 2017'
> d.toTimeString();
'16:57:06 GMT+0800 (Malay Peninsula Standard Time)'
*/
const {Model} = require('objection');
const Knex = require('knex');
const config = require('../knexfile');
var env         = 'development';  
var knex        = require('knex')(config[env]);

Model.knex(knex);

const isLoggedIn = require('./isLoggedIn');


module.exports = function (app,passport) {
    app.get('/',function (req,res) {
        res.render('index.ejs',{ title : "Welcome to RVRC Room Booking System"});
    });  

    app.get('/logout', function (req,res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/auth/openid', passport.authenticate('openid'));

    app.get('/auth/openid/return', passport.authenticate('openid', 
        { successRedirect: '/viewBooking',
            failureRedirect: '/' })
    );

    bookingRoutes(app, passport);
    registrationRoutes(app, passport);
}