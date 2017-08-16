const Warning = require('../models/warning');
const GroupWarning = require('../models/groupwarning');

var newDate = require('../api/date-methods');

const isLoggedIn = require('./isLoggedIn');

var control = require('./control');
var flash = require('./flash');

var checkNDays = config.checkNDays;
var nslots = config.nslots;

module.exports = function(app, passport) {
	app.get('/warning', function(req, res) {
		req.flash('invitationToken', 'woshiwenmogu');
		if (req.url == '/warning') {
			res.redirect('/myGroupWarning');
		} else {
			var NusNetsId = req.url.split('=')[1];
			User.getUserInfo(NusNetsId)
			.then(userinfo=> {
				GroupWarning.getWarningsFromGroupId(userinfo.groupid)
				.then(warnings=> {
					res.render('warning.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, warnings:warnings})
				})
			})
			.catch(err=> {
				res.redirect('/viewBooking');
			})
		}
	})

	app.get('/myGroupWarning', isLoggedIn, function(req, res) {
		flash(req);
		control(req, 
				res,
				function(gid, userinfo) {
					GroupWarning.getWarningsFromGroupId(userinfo.groupid)
					.then(warnings=> {
						res.render('warning.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, warnings:warnings})
					})
				}, 
				function(gid, userinfo) {
					GroupWarning.getWarningsFromGroupId(userinfo.groupid)
					.then(warnings=> {
						res.render('warning.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, warnings:warnings})
					})
				},
				function(userinfo) {
					res.redirect('/manageRegister')
				}, 
				function() {
					res.redirect('/register')
				})
	})

	app.get('/report', isLoggedIn, function(req, res) {
		// only ppl in group can report
		var dates = newDate.pastDatesHyphenString(checkNDays).reverse();
		var timeStringArray = newDate.timeStringArray(6, 0, 0, nslots)
		flash(req);
		control(req,
				res,
				function(gid, userinfo) {
					res.render('report.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, dates:dates, timeStringArray:timeStringArray})
				}, 
				function(gid, userinfo) {
					res.render('report.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, dates:dates, timeStringArray:timeStringArray})
				}, 
				function(userinfo) {
					res.render('report.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, dates:dates, timeStringArray:timeStringArray})
				}, 
				function() {
					res.redirect('/register')
				})
	})

	app.post('/manageReport', function(req, res) {
		//send email to admin 
		//then give a confirmation page
	})
}