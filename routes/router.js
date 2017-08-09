const User = require('../models/user');
var limit = 1;
var bookingRoutes = require('./booking-routes');
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
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig.development);

Model.knex(knex);

isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        User.isUserInDB(req.user.NusNetsID)
        .then(boo => {
            if (boo == true) {
                return next();
            } else {
            res.redirect('/');
            }
        })
    } else {
        res.redirect('/');
    }
}

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

var today = new Date();
var tmr = today.addDays(1);
var twoDaysLater = today.addDays(2);
var threeDaysLater = today.addDays(3);
var fourDaysLater = today.addDays(4);

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
}