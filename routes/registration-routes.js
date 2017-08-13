const User = require('../models/user');
const Zu = require('../models/zu');
const Room = require('../models/room');
const BookRecord = require('../models/bookrecord');
const Token = require('../models/token');

var control = require('./control');

var newDate = require('../api/date-methods');

const isLoggedIn = require('./isLoggedIn');
var flash = require('./flash');

var memberNumberLimit = 5;
var checkNDays = 4;

module.exports = function(app, passport, invitationToken) {

	app.get('/register', isLoggedIn, function(req, res) {
		//only for hvnt registered
		flash(req);
		control(req, res,
				function(gid) {
					res.redirect('/viewBooking');
				},
				function(gid) {
					res.redirect('/viewBooking');
				}, 
				function() {
					res.redirect('/manageRegister');
				},
				function() {
					res.render('register.ejs', {profile:req.user})
				})
	})

	app.post('/processRegister', isLoggedIn, function(req, res) {
		//this route is for redirection only. 
		console.log('body: ', req.body);
		//body: {}
		flash(req);

	    var token = req.flash('invitationToken')[0];
        console.log('flashhhhhhhhhhhhhhhhhhhhhhhh');
        console.log('token', token);
	    console.log('FLASHHHHHHHHHHHHHHHHHHHHHHHHH');
		if (req.body.displayName == undefined) {
			//body is empty => hv to use req.user.displayName
			User.registerUser(req.user.NusNetsID, req.user.displayName, req.user.emails[0].value)
			.then(resul=> {
				if (token == "woshiwenmogu") {
					req.flash('invitationToken', 'woshiwenmogu');
					res.redirect('/manageRegister');
				} else {
					req.flash('invitationToken', token);
					res.redirect('/joinAGroup');
				}
			})
		} else {
			//body is not empty => hv to use req.body.displayName
			User.registerUser(req.user.NusNetsID, req.body.displayName, req.body.email)
			.then(resul=> {
				if (token == "woshiwenmogu") {
					req.flash('invitationToken', 'woshiwenmogu');
					res.redirect('/manageRegister');
				} else {
					req.flash('invitationToken', token);
					res.redirect('/joinAGroup');
				}
			})
		}
	})

	app.get('/manageRegister', isLoggedIn, function(req, res) {
		//only for registered and doesnt hv a group 
		//       or in a group but group is not full
		flash(req);
		
		control(req, 
				res,
				function(gid, userinfo) {
					res.redirect('/viewBooking');
				}, 
				function(gid, userinfo) {
					res.render('manageRegister.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}})	
				}, 
				function(userinfo) {
					res.render('manageRegister.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}})	
				}, 
				function() {
					res.redirect('/register');
				})	
	})

	app.get('/startAGroup', isLoggedIn, function(req, res) {
		//only for registered and doesnt hv a group
		control(req,
				res,
				function(gid, userinfo) {
					res.redirect('/viewBooking');
				}, 
				function(gid, userinfo) {
					res.redirect('/viewBooking');
				}, 
				function(userinfo) {
					//registered and doesnt hv group
					res.render('startAGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, emails:[{value: userinfo.email}]}})
				}, 
				function() {
					res.redirect('/register');
				})
	})

	app.post('/manageStartAGroup', isLoggedIn, function(req, res) {
		//this is only for redirect
		User.createGroup(req.user.NusNetsID)
		.then(n=> {
			res.redirect('/manageGroup');
		})
	})

	app.get('/joinAGroup', isLoggedIn, function(req, res) {
        //only for registered and doesnt hv a group
        
        flash(req);

	    var token = req.flash('invitationToken')[0];
        console.log('flashhhhhhhhhhhhhhhhhhhhhhhh');
        console.log('token', token);
	    console.log('FLASHHHHHHHHHHHHHHHHHHHHHHHHH');
	    if (token == 'woshiwenmogu') {
	    	//no token lol redirect to manageRegister
	    	console.log('revamping token');
	    	req.flash('invitationToken', "woshiwenmogu");
	    	res.redirect('/manageRegister');
	    } else {
		    control(req,
	                res,
	                function(gid, userinfo) {
	                    res.redirect('/viewBooking');
	                },
	                function(gid, userinfo) {
	                    res.redirect('/manageRegister');
	                }, 
	                function(userinfo) {
	                    //retrieve group info by nusnetsid and token (req.flash[0])
	                    res.send(token);
	                }, 
	                function() {
	                    res.redirect('/register');
	                })	
	    }
        
    })

    app.get('/manageGroup', isLoggedIn, function(req, res) {
    	control(req,
    			res,
    			function(gid, userinfo) {
    				User.getMembersInfo(gid) 
    				.then(info=> {
    					Zu.numberOfWarning(gid)
    					.then(warning=> {
    						BookRecord.BookingByAGroupInPastNDays(gid, checkNDays, [])
    						.then(resul=> {
    							User.howManyUsersInGroup(gid)
    							.then(num=> {
    								res.render('manageGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, emails:[{value: userinfo.email}]}, membersInfo:info, pastBooking:resul, memberNumber:num, memberNumberLimit: memberNumberLimit, warning:warning, dates: newDate.pastDatesHyphenString(checkNDays).reverse()})
    							})
    						})
    					})
    				})
    			}, 
    			function(gid, userinfo) {
    				User.getMembersInfo(gid) 
    				.then(info=> {
    					Zu.numberOfWarning(gid)
    					.then(warning=> {
    						BookRecord.BookingByAGroupInPastNDays(gid, checkNDays, [])
    						.then(resul=> {
    							User.howManyUsersInGroup(gid)
    							.then(num=> {
    								res.render('manageGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, emails:[{value: userinfo.email}]}, membersInfo:info, pastBooking:resul, memberNumber:num, memberNumberLimit: memberNumberLimit, warning:warning, dates: newDate.pastDatesHyphenString(checkNDays).reverse()})
    							})
    						})
    					})
    				})
    			}, 
    			function(userinfo) {
    				res.redirect('/manageRegister');
    			}, 
    			function() {
    				res.redirect('/register');
    			})
    })


	app.get('/inviteAMember', isLoggedIn, function(req, res) {
		// only for registered and in a group and the group hvnt hit the upper limit for number of members 
		control(req,
				res,
				function(gid, userinfo) {
					User.howManyUsersInGroup(gid) 
					.then(num=> {
						if (num < memberNumberLimit) {
							//allow page loading
							res.render('inviteAMember.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, memberNumber:num, memberNumberLimit:memberNumberLimit})
						} else {
							//redirect to manageGroup
							res.redirect('/manageGroup');
						}
					})

				}, 
				function(gid, userinfo) {
					User.howManyUsersInGroup(gid) 
					.then(num=> {
						if (num < memberNumberLimit) {
							//allow page loading
							res.render('inviteAMember.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, memberNumber:num, memberNumberLimit:memberNumberLimit})
						} else {
							//redirect to manageGroup
							res.redirect('/manageGroup');
						}
					})
				}, 
				function(userinfo) {
					res.redirect('/manageRegister');
				}, 
				function() {
					res.redirect('/register');
				})
	})

	app.post('/manageInviteAMember', isLoggedIn, function(req, res) {

	})

	app.get('/dismissGroup', isLoggedIn, function(req, res) {
		// only for group not exceeding the dismissGroupWarningLimit
	})
}