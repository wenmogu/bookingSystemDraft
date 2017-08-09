const User = require('../models/user');
const Zu = require('../models/zu');
const BookRecord = require('../models/bookrecord');
var control = require('./control');
var newDate = require('../api/date-methods');

var checkNDays = 4;

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





module.exports = function(app, passport) {
	app.get('/viewBooking', isLoggedIn, function(req, res) {
        control(req, res, 
                function(gid){	
                	BookRecord.BookingByAGroupInNextNDays(gid, checkNDays, [])
                	.then(resul=> {
                		res.render('viewBooking.ejs', 
                			{profile:req.user, groupid: gid, booking:resul, dates:newDate.datesHyphenString(checkNDays)});
                	}, err=> {
                		console.error(err);
                	})
                }, 
                function(gid){res.redirect('/manageRegister')},
                function(){res.redirect('/manageRegister')},
                function(){res.redirect('/register')}
                )
    })

    app.get('/info', function(req, res) {
    	res.render('info.ejs')
    });

    app.get('/booking');

    app.get('/manageBooking');

    app.get('/cancelBooking');

    app.get('/manageCancel');

    //for testing purpose: 
    app.get('/register', isLoggedIn, function(req, res) {
        res.send("hello register pls")
    })
    app.get('/manageRegister', isLoggedIn, function(req, res) {
        res.send('manage register');
    })
}



// if registered 
// 	=> registered
// 		=> in group
// 			=> group full
// 				//do something
// 			=> group not full
// 				//do something
// 		=> not in group
// 			//do something
// 	=> not registered
// 		//do something