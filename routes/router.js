const User = require('../models/User');
var bookingRoutes = require('./booking-routes');
var registrationRoutes = require('./registration-routes');
var warningRoutes = require('./warning-routes');
var adminRoutes = require('./admin-routes');

const isLoggedIn = require('./isLoggedIn');


const {Model} = require('objection');
const Knex = require('knex');
const config = require('../knexfile');
var env         = 'development';  
var knex        = require('knex')(config[env]);

Model.knex(knex);


module.exports = function (app,passport) {
    app.get('/',function (req,res) {
        console.log("req.user: ", req.user);
        if (req.user != undefined) {
            if (req.url == '/') {
                req.flash('invitationToken'); //this is to clear the previous accumulation of invitationToken
                req.flash('invitationToken', "woshiwenmogu");
                res.redirect('/viewBooking');
            } else {
                req.flash('invitationToken');//this is to clear the previous accumulation of invitationToken
                req.flash('invitationToken', req.url.split('=')[1]);
                res.redirect('/viewBooking');
            }
        } else {
            if (req.url == '/') {
                req.flash('invitationToken'); //this is to clear the previous accumulation of invitationToken
                req.flash('invitationToken', "woshiwenmogu");
                res.render('index.ejs',{ title:"Welcome to RVRC Room Booking System"});
            } else {
                req.flash('invitationToken');//this is to clear the previous accumulation of invitationToken
                req.flash('invitationToken', req.url.split('=')[1]);
                res.render('index.ejs',{ title:"Welcome to RVRC Room Booking System"});
            }   
        }
    });  

    app.get('/logout', function (req,res) {
        req.flash('invitationToken');//this is to clear the previous accumulation of invitationToken
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
    warningRoutes(app, passport);
    adminRoutes(app, passport);

}