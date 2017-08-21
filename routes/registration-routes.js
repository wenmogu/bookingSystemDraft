const User = require('../models/User');
const Zu = require('../models/Zu');
const Room = require('../models/Room');
const BookRecord = require('../models/BookRecord');
const Token = require('../models/Token');

var control = require('./control');

var mailer = require('../API/mailer');
var newDate = require('../API/date-methods');

const isLoggedIn = require('./isLoggedIn');
var flash = require('./flash');

var config = require('../config');

var memberNumberLimit = config.memberNumberLimit;
var checkNDays = config.checkNDays;
var webaddress = config.webaddress;
var dismissGroupWarningLimit = config.dismissGroupWarningLimit;

module.exports = function(app, passport) {

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
		flash(req);
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
		flash(req);
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
	                    Token.getGidFromToken(token)
	                    .then(gid=> {
	                    	User.getMembersInfo(gid)
	                    	.then(info=> {
	                    		Zu.numberOfWarning(gid)
	                    		.then(warning=> {
	                    			User.howManyUsersInGroup(gid)
	                    			.then(num=> {
	                    				BookRecord.BookingByAGroupInPastNDays(gid, checkNDays, [])
	                    				.then(resul=> {
	                    					req.flash('invitationToken', 'woshiwenmogu');
	                    					res.render('joinAGroup.ejs', {invitationToken:token, profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, emails:[{value: userinfo.email}]}, groupid:gid, membersInfo:info, pastBooking:resul, memberNumber:num, memberNumberLimit: memberNumberLimit, warning:warning, dates: newDate.pastDatesHyphenString(checkNDays).reverse()})
	                    				})
	                    			})
	                    		})
	                    	})
	                    })
	                }, 
	                function() {
	                    res.redirect('/register');
	                })	
	    }  
    })

    app.post('/manageJoinAGroup', isLoggedIn, function(req, res) {
    	flash(req);
    	console.log("bodyyyyy: ", req.body);
    	User.addGroup(req.user.NusNetsID, parseInt(req.body.gid))
    	.then(resul=> {
    		Token.deleteTokenRelatedToUser(req.user.NusNetsID)
    		.then(del=> {
    			res.redirect('/manageGroup');
    		})
    	})
    })

    app.get('/manageGroup', isLoggedIn, function(req, res) {
    	flash(req);
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
    								res.render('manageGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, emails:[{value: userinfo.email}], groupid:gid}, membersInfo:info, pastBooking:resul, memberNumber:num, memberNumberLimit: memberNumberLimit, warning:warning, dates: newDate.pastDatesHyphenString(checkNDays).reverse()})
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
    								res.render('manageGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, emails:[{value: userinfo.email}], groupid:gid}, membersInfo:info, pastBooking:resul, memberNumber:num, memberNumberLimit: memberNumberLimit, warning:warning, dates: newDate.pastDatesHyphenString(checkNDays).reverse()})
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
		flash(req);
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
		//email contains: inviter name, members info, warning, token link: link.local(localhost:3000) + /?invitationToken=asdfasdfasdfsadf
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			User.getMembersInfo(userinfo.groupid)
			.then(membersInfo=> {
				Zu.numberOfWarning(userinfo.groupid)
				.then(warning=> {
					Token.createTokenFor(req.body.NusNetsID, userinfo.groupid)
					.then(token=> {
						mailer.sendInvitationTo(mailer.formatHTMLInvitation(userinfo, membersInfo, warning, webaddress, token), "You are invited to join a Group!", [req.body.email])
						.then(()=> {
							console.log('html invitation sent');
							res.render('manageInviteAMember.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, recipient:req.body.email, invitationContent:mailer.formatHTMLInvitation(userinfo, membersInfo, warning)})
						})
						.catch(err=> {
							console.log("html page sending error: ", err);
						})	
					})
					.catch(err=> {
						res.redirect('/inviteAMember');
					})
				})
			})
		})
	})

	app.get('/dismissGroup', isLoggedIn, function(req, res) {
		// only for group not exceeding the dismissGroupWarningLimit
		flash(req);
		control(req, 
				res,
				function(gid, userinfo) {
					Zu.numberOfWarning(gid)
					.then(warning=> {
						res.render('dismissGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, warning:warning, dismissGroupWarningLimit:dismissGroupWarningLimit})
					})
				}, 
				function(gid, userinfo) {
					Zu.numberOfWarning(gid)
					.then(warning=> {
						res.render('dismissGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, warning:warning, dismissGroupWarningLimit:dismissGroupWarningLimit})
					})
				}, 
				function(userinfo) {
					res.redirect('/manageRegister');
				}, 
				function() {
					res.redirect('/register');
				})
	})

	app.post('/manageDismissGroup', isLoggedIn, function(req, res) {
		flash(req);
		//delete all the group booking record
		//remove all the groupid from groupmembers
		//remove the groupid from zu
		//send email to the group members
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			User.getMembersEmail(userinfo.groupid)
			.then(recipientarr=> {
				User.removeGroup(userinfo.groupid)
				.then(()=> {
					BookRecord.removeBookingByGroup(userinfo.groupid)
					.then(resul=> {
						mailer.sendEmailTo(userinfo.name + " has dismissed Group " + userinfo.groupid + ".", "Your Group has been DISMISSED", recipientarr)
						.then(resull=> {
							res.render('manageDismissGroup.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, recipientarr})
						})
					})
				})
			})
		})
		.catch(err=> {;})
	})
}