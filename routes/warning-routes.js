const Warning = require('../models/Warning');
const GroupWarning = require('../models/GroupWarning');
const User = require('../models/User');

const passwords = require('../passwords');

var newDate = require('../api/date-methods');
var mailer = require('../api/mailer');

const isLoggedIn = require('./isLoggedIn');

var control = require('./control');
var flash = require('./flash');

var config = require('../config');
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
					Warning.listOfWarnings()
					.then(list=> {
						res.render('report.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, dates:dates, timeStringArray:timeStringArray, list:list})
					})
				}, 
				function(gid, userinfo) {
					Warning.listOfWarnings()
					.then(list=> {
						res.render('report.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, dates:dates, timeStringArray:timeStringArray, list:list})
					})				
				}, 
				function(userinfo) {
					Warning.listOfWarnings()
					.then(list=> {
						res.render('report.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, dates:dates, timeStringArray:timeStringArray, list:list})
					})
				}, 
				function() {
					res.redirect('/register')
				})
	})

	app.post('/manageReport', function(req, res) {
		//send email to admin 
		//then give a confirmation page
		flash(req);
		mailer.sendReportTo(mailer.formatHTMLReport(req.user.NusNetsID, req.body.warningtype, req.body.detail, req.body.offendergroupid, req.body.offendername, req.body.date, req.body.start, req.body.end)
							, [passwords.user])
		.then(bool=> {
			User.getUserInfo(req.user.NusNetsID)
			.then(userinfo=> {
				res.render('manageReport.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}});
			})
			.catch(err=> {
				console.log(err);
			})
		})
	})
}