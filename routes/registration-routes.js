const User = require('../models/user');
const Zu = require('../models/zu');
const Room = require('../models/room');
const BookRecord = require('../models/bookrecord');

var control = require('./control');

var newDate = require('../api/date-methods');

const isLoggedIn = require('./isLoggedIn');

module.exports = function(app, passport) {

	app.get('/register', isLoggedIn, function(req, res) {
		//only for hvnt registered
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
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			control(req, 
					res,
					function(gid) {
						res.redirect('/viewBooking');
					}, 
					function(gid) {
						User.getMembersInfo(gid)
						.then(info=> {
							res.render('manageRegisterGroupNotFull.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, membersInfo:info})
						})
					}, 
					function() {
						res.render('manageRegisterNotInGroup.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}})	
					}, 
					function() {
						res.redirect('/register');
					})	
		})
		
	})

	app.get('/startAGroup', isLoggedIn, function(req, res) {
		//only for registered and doesnt hv a group
	})

	app.get('/joinAGroup', isLoggedIn, function(req, res) {
		//only for registered and doesnt hv a group

	})

	app.get('/inviteAMember', isLoggedIn, function(req, res) {
		// only for registered and in a group and the group is not full
	})

	app.get('/dismissGroup', isLoggedIn, function(req, res) {
		// only for group not exceeding the dismissGroupWarningLimit
	})
}