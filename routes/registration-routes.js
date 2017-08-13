const User = require('../models/user');
const Zu = require('../models/zu');
const Room = require('../models/room');
const BookRecord = require('../models/bookrecord');

var control = require('./control');

var newDate = require('../api/date-methods');

const isLoggedIn = require('./isLoggedIn');
var flash = require('./flash');

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
		if (req.body.displayName == undefined) {
			//body is empty => hv to use req.user.displayName
			User.registerUser(req.user.NusNetsID, req.user.displayName, req.user.emails[0].value)
			.then(resul=> {
				res.redirect('/manageRegister');
			})
		} else {
			//body is not empty => hv to use req.body.displayName
			User.registerUser(req.user.NusNetsID, req.body.displayName, req.body.email)
			.then(resul=> {
				res.redirect('/manageRegister');
			})
		}
	})

	app.get('/manageRegister', isLoggedIn, function(req, res) {
		//only for registered and doesnt hv a group 
		//       or in a group but group is not full
		flash(req);
		// console.log('flash message: ', req.flash('invitationToken')[0]);
		control(req, 
				res,
				function(gid, userinfo) {
					res.redirect('/viewBooking');
				}, 
				function(gid, userinfo) {
					User.getMembersInfo(gid)
					.then(info=> {
						res.render('manageRegisterGroupNotFull.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, membersInfo:info})
					})
				}, 
				function(userinfo) {
					res.render('manageRegisterNotInGroup.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}})	
				}, 
				function() {
					res.redirect('/register');
				})	

		
	})

	app.get('/startAGroup', isLoggedIn, function(req, res) {
		//only for registered and doesnt hv a group
		flash(req);
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


	app.get('/inviteAMember', isLoggedIn, function(req, res) {
		// only for registered and in a group and the group is not full
	})

	app.get('/dismissGroup', isLoggedIn, function(req, res) {
		// only for group not exceeding the dismissGroupWarningLimit
	})
}