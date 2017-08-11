const User = require('../models/user');
const Zu = require('../models/zu');
const Room = require('../models/room');
const BookRecord = require('../models/bookrecord');
var control = require('./control');
var bookorcancel = require('./book-cancel');
var newDate = require('../api/date-methods');

var checkNDays = 4;
var nslots = 9;
var bookingLimit = 2;


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
                			{profile:req.user, groupid: gid, booking:resul, dates:newDate.datesHyphenString(checkNDays), dateAndTimeString:new newDate().toDateAndTimeString()});
                	}, err=> {
                		console.error(err);
                	})
                }, 
                function(gid){
                    BookRecord.totalNumberOfBookingByAGroupInNextNDays(gid, checkNDays)
                    .then(num=> {
                        if (num == 0) {
                            res.redirect('/manageRegisiter');
                        } else {
                            BookRecord.BookingByAGroupInNextNDays(gid, checkNDays, [])
                            .then(resul=> {
                                res.render('viewBooking.ejs', 
                                    {profile:req.user, groupid: gid, booking:resul, dates:newDate.datesHyphenString(checkNDays), dateAndTimeString:new newDate().toDateAndTimeString()});
                            }, err=> {
                                console.error(err);
                            })        
                        }
                    })
                },
                function(){
                    res.redirect('/manageRegister')
                },
                function(){
                    res.redirect('/register')
                })
    })

    app.get('/info',function(req, res) {
    	BookRecord.BookingByAllGroupsInNextNDays(checkNDays, nslots)
    	.then(resul=>{
    		Room.allRoomNumber()
    		.then(roomnumbers => {
    			if (req.user == undefined) {
    				res.render('info.ejs', {profile:req.user, booking:resul, allRoomNumber:roomnumbers, dates:newDate.datesHyphenString(checkNDays), timeStringArray:newDate.timeStringArray(6, 0, 0, nslots), numberOfTimeslots: nslots, dateAndTimeString:new newDate().toDateAndTimeString()});
    				throw("render info page");
    			} else {
    				User.getUserInfo(req.user.NusNetsID)
    				.then(userinfo=> {
    					if (userinfo.groupid == null) {
    						res.render('info.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid}, booking:resul, allRoomNumber:roomnumbers, dates:newDate.datesHyphenString(checkNDays), timeStringArray:newDate.timeStringArray(6, 0, 0, nslots), numberOfTimeslots: nslots, dateAndTimeString:new newDate().toDateAndTimeString()});
    						throw("render info page");
    					} else {
    						BookRecord.numberOfBookingByAGroupInNextNDays(userinfo.groupid, checkNDays)
    						.then(dateAndNumber=> {
    							res.render('info.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, booking:resul, allRoomNumber:roomnumbers, dates:newDate.datesHyphenString(checkNDays), timeStringArray:newDate.timeStringArray(6, 0, 0, nslots), numberOfTimeslots: nslots, dateAndTimeString:new newDate().toDateAndTimeString(), dateAndNumber:dateAndNumber, bookingLimit:bookingLimit});
    							throw("render info page");
    						},null)
    					}
    				}, null)
    			}
    		}, null)
    	}).catch(err => {
	        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	        console.error(err);
	        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
    	})
    });

    app.get('/booking', isLoggedIn, function(req, res) {
        // console.log(req.url);
        // /booking?room=105&start=20:00:00&end=22:00:00&date=2017-8-11
        if (req.url == '/booking') {
            res.redirect('/info');
        } else {
            const rid = parseInt(req.url.split('=')[1].split('&')[0]);
            const d = req.url.split('=')[4];
            const start = req.url.split('=')[2].split('&')[0];
            const end = req.url.split('=')[3].split('&')[0];
            control(req, res, 
                    function(gid) {
                        bookorcancel.bookForm(req, res, rid, d, start, end, gid);
                    }, 
                    function(gid) {
                        res.redirect('/manageRegister')
                    }, 
                    function() {
                        res.redirect('/manageRegister')
                    }, 
                    function() {
                        res.redirect('/register')
                    })   
        }
    });

    app.post('/manageBooking', isLoggedIn, function(req, res) {
        // console.log(req.headers.referer);
        // http://localhost:3000/cancelBooking?room=102&start=14:00:00&end=16:00:00&date=2017-8-13
        const rid = parseInt(req.headers.referer.split('=')[1].split('&')[0]);
        const d = req.headers.referer.split('=')[4];
        const start = req.headers.referer.split('=')[2].split('&')[0];
        const end = req.headers.referer.split('=')[3].split('&')[0];
        const timeStringArray = newDate.timeStringArray(6, 0, 0, nslots);

        if (timeStringArray.includes(start) && timeStringArray.includes(end)) {
             User.getUserGroupId(req.user.NusNetsID)
            .then(gid=> {
                bookorcancel.manageBooking(req, res, rid, d, start, end, gid);
            })   
        } else {
            res.redirect('/info');
        } 
    });

    app.get('/cancelBooking', isLoggedIn, function(req, res) {
        if (req.url == '/cancelBooking') {
            res.redirect('/viewBooking')
        } else {
            const rid = parseInt(req.url.split('=')[1].split('&')[0]);
            const d = req.url.split('=')[4];
            const start = req.url.split('=')[2].split('&')[0];
            const end = req.url.split('=')[3].split('&')[0];
            control(req, res, 
                    function(gid) {
                        bookorcancel.cancelForm(req, res, rid, d, start, end, gid);
                    }, 
                    function(gid) {
                        bookorcancel.cancelForm(req, res, rid, d, start, end, gid);
                    }, 
                    function() {
                        res.redirect('/manageRegister')
                    }, 
                    function() {
                        res.redirect('/register')
                    })
        }
    });

    app.post('/manageCancel', isLoggedIn, function(req, res) {
        // console.log(req.headers.referer);
        // http://localhost:3000/cancelBooking?room=102&start=14:00:00&end=16:00:00&date=2017-8-13
        const rid = parseInt(req.headers.referer.split('=')[1].split('&')[0]);
        const d = req.headers.referer.split('=')[4];
        const start = req.headers.referer.split('=')[2].split('&')[0];
        const end = req.headers.referer.split('=')[3].split('&')[0];
        const timeStringArray = newDate.timeStringArray(6, 0, 0, nslots);
        
        if (timeStringArray.includes(start) && timeStringArray.includes(end)) {
             User.getUserGroupId(req.user.NusNetsID)
            .then(gid=> {
                bookorcancel.manageCancel(req, res, rid, d, start, end, gid);
            })   
        } else {
            res.redirect('/info');
        } 
    });

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