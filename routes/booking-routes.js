const User = require('../models/user');
const Zu = require('../models/zu');
const Room = require('../models/room');
const BookRecord = require('../models/bookrecord');
var control = require('./control');
var bookorcancel = require('./book-cancel');
var flash = require('./flash');

var newDate = require('../api/date-methods');

const isLoggedIn = require('./isLoggedIn');
 
var config = require('../config');
var checkNDays = config.checkNDays;
var nslots = config.nslots;
var bookingLimit = config.bookingLimit;

module.exports = function(app, passport) {
	app.get('/viewBooking', isLoggedIn, function(req, res) {

        flash(req);
        control(req, res, 
                function(gid, userinfo){	
                	BookRecord.BookingByAGroupInNextNDays(gid, checkNDays, [])
                	.then(resul=> {
                		res.render('viewBooking.ejs', 
                			{profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: gid, booking:resul, dates:newDate.datesHyphenString(checkNDays), dateAndTimeString:new newDate().toDateAndTimeString()});
                	}, err=> {
                		console.error(err);
                	})
                }, 
                function(gid, userinfo){
                    BookRecord.totalNumberOfBookingByAGroupInNextNDays(gid, checkNDays)
                    .then(num=> {
                        if (num == 0) {
                            res.redirect('/manageRegister');
                        } else {
                            BookRecord.BookingByAGroupInNextNDays(gid, checkNDays, [])
                            .then(resul=> {
                                res.render('viewBooking.ejs', 
                                    {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: gid, booking:resul, dates:newDate.datesHyphenString(checkNDays), dateAndTimeString:new newDate().toDateAndTimeString()});
                            }, err=> {
                                console.error(err);
                            })        
                        }
                    })
                },
                function(userinfo){
                    const invitationToken = req.flash('invitationToken')[0];
                    console.log('invitationToken', invitationToken);
                    if ( invitationToken == 'woshiwenmogu') {
                        req.flash('invitationToken', "woshiwenmogu");
                        res.redirect('/manageRegister');
                    } else {
                        req.flash('invitationToken', invitationToken);
                        res.redirect('/joinAGroup');
                    }
                },
                function(){
                    res.redirect('/register')
                })
    })

    app.get('/info',function(req, res) {
        req.flash('invitationToken', "woshiwenmogu");
        flash(req);
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
        flash(req);
        if (req.url == '/booking') {
            res.redirect('/info');
        } else {
            const rid = parseInt(req.url.split('=')[1].split('&')[0]);
            const d = req.url.split('=')[4];
            const start = req.url.split('=')[2].split('&')[0];
            const end = req.url.split('=')[3].split('&')[0];
            control(req, res, 
                    function(gid, userinfo) {
                        bookorcancel.bookForm(req, res, rid, d, start, end, gid, userinfo);
                    }, 
                    function(gid, userinfo) {
                        res.redirect('/manageRegister')
                    }, 
                    function(userinfo) {
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
        flash(req);
        const rid = parseInt(req.headers.referer.split('=')[1].split('&')[0]);
        const d = req.headers.referer.split('=')[4];
        const start = req.headers.referer.split('=')[2].split('&')[0];
        const end = req.headers.referer.split('=')[3].split('&')[0];
        const timeStringArray = newDate.timeStringArray(6, 0, 0, nslots);
        const datesHyphenString = newDate.datesHyphenString(checkNDays);
        const dateAndTimeString = new newDate().toDateAndTimeString();
        console.log('heyyyyy');
        console.log((timeStringArray.indexOf(end) - timeStringArray.indexOf(start) == 1),timeStringArray.includes(start), timeStringArray.includes(end), datesHyphenString.includes(d), d >= dateAndTimeString.dateString, start > dateAndTimeString.timeString);

        if ((timeStringArray.indexOf(end) - timeStringArray.indexOf(start) == 1) && 
            timeStringArray.includes(start) && 
            timeStringArray.includes(end) && 
            datesHyphenString.includes(d) && 
            d > dateAndTimeString.dateString) {
            User.getUserGroupId(req.user.NusNetsID)
            .then(gid=> {
                User.getUserInfo(req.user.NusNetsID)
                .then(userinfo=> {
                    bookorcancel.manageBooking(req, res, rid, d, start, end, gid, userinfo);                   
                })
            })   
        } else if ((timeStringArray.indexOf(end) - timeStringArray.indexOf(start) == 1) && 
            timeStringArray.includes(start) && 
            timeStringArray.includes(end) && 
            datesHyphenString.includes(d) && 
            d == dateAndTimeString.dateString && 
            start > dateAndTimeString.timeString) {
            User.getUserGroupId(req.user.NusNetsID)
            .then(gid=> {
                User.getUserInfo(req.user.NusNetsID)
                .then(userinfo=> {
                    bookorcancel.manageBooking(req, res, rid, d, start, end, gid, userinfo);                   
                })
            }) 
        } else {
            res.redirect('/info');
        }
    });

    app.get('/cancelBooking', isLoggedIn, function(req, res) {
        flash(req);
        if (req.url == '/cancelBooking') {
            res.redirect('/viewBooking')
        } else {
            const rid = parseInt(req.url.split('=')[1].split('&')[0]);
            const d = req.url.split('=')[4];
            const start = req.url.split('=')[2].split('&')[0];
            const end = req.url.split('=')[3].split('&')[0];
            control(req, res, 
                    function(gid, userinfo) {
                        bookorcancel.cancelForm(req, res, rid, d, start, end, gid, userinfo);
                    }, 
                    function(gid, userinfo) {
                        bookorcancel.cancelForm(req, res, rid, d, start, end, gid, userinfo);
                    }, 
                    function(userinfo) {
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
        flash(req);
        const rid = parseInt(req.headers.referer.split('=')[1].split('&')[0]);
        const d = req.headers.referer.split('=')[4];
        const start = req.headers.referer.split('=')[2].split('&')[0];
        const end = req.headers.referer.split('=')[3].split('&')[0];
        const timeStringArray = newDate.timeStringArray(6, 0, 0, nslots);
        const datesHyphenString = newDate.datesHyphenString(checkNDays);
        const dateAndTimeString = new newDate().toDateAndTimeString(); 

        if ((timeStringArray.indexOf(end) - timeStringArray.indexOf(start) == 1) && 
            timeStringArray.includes(start) && 
            timeStringArray.includes(end) && 
            datesHyphenString.includes(d) && 
            d > dateAndTimeString.dateString) {
            User.getUserGroupId(req.user.NusNetsID)
            .then(gid=> {
                User.getUserInfo(req.user.NusNetsID)
                .then(userinfo=> {
                    bookorcancel.manageCancel(req, res, rid, d, start, end, gid, userinfo);                   
                })
            })   
        } else if ((timeStringArray.indexOf(end) - timeStringArray.indexOf(start) == 1) && 
            timeStringArray.includes(start) && 
            timeStringArray.includes(end) && 
            datesHyphenString.includes(d) && 
            d == dateAndTimeString.dateString && 
            start > dateAndTimeString.timeString) {
            User.getUserGroupId(req.user.NusNetsID)
            .then(gid=> {
                User.getUserInfo(req.user.NusNetsID)
                .then(userinfo=> {
                    bookorcancel.manageCancel(req, res, rid, d, start, end, gid, userinfo);                   
                })
            }) 
        } else {
            res.redirect('/info');
        }
    });
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