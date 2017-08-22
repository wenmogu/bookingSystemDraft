const User = require('../models/User');
const Zu = require('../models/Zu');
const Room = require('../models/Room');
const BookRecord = require('../models/BookRecord');
const Token = require('../models/Token');
const Warning = require('../models/Warning');
const GroupWarning = require('../models/GroupWarning');

var control = require('./control');

var mailer = require('../API/mailer');
var newDate = require('../API/date-methods')

const isAdminLoggedIn = require('./isAdminLoggedIn');
var flash = require('./flash');

var config = require('../config');
var adminCheckNDays = config.adminCheckNDays;
var nslots = config.nslots;

module.exports = function(app, passport) {

	app.get('/admin', isAdminLoggedIn, function(req, res) {
		//navigation page: all sorts of links 
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			res.render('admin.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}})
		})
	})

	app.get('/adminBookRecord', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			BookRecord.BookingByAllGroupsInNextNDays(adminCheckNDays, nslots)
			.then(resul=> {
				Room.allRoomNumber()
				.then(roomnumbers=> {
					BookRecord.numberOfBookingByAGroupInNextNDays(userinfo.groupid, adminCheckNDays)
					.then(dateAndNumber=> {
						res.render('adminBookRecord.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, booking:resul, allRoomNumber:roomnumbers, dates:newDate.datesHyphenString(adminCheckNDays), timeStringArray:newDate.timeStringArray(6, 0, 0, nslots), numberOfTimeslots: nslots, dateAndTimeString:new newDate().toDateAndTimeString(), dateAndNumber:dateAndNumber});
					},null)
				})
			})
		})
	})

	app.get('/adminBooking', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			BookRecord.BookingByAGroupInNextNDays(userinfo.groupid, adminCheckNDays, [])
        	.then(resul=> {
        		res.render('viewBooking.ejs', 
        			{profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, booking:resul, dates:newDate.datesHyphenString(adminCheckNDays), dateAndTimeString:new newDate().toDateAndTimeString()});
        	}, err=> {
        		console.error(err);
        	})
		})

	})

	app.get('/adminViewDetail', isAdminLoggedIn, function(req, res) {
		flash(req);
		if (req.url == '/adminViewDetail') {
			res.redirect('/adminBookRecord');
		} else {
			const rid = parseInt(req.url.split('=')[1].split('&')[0]);
            const d = req.url.split('=')[4];
            const start = req.url.split('=')[2].split('&')[0];
            const end = req.url.split('=')[3].split('&')[0];
            User.getUserInfo(req.user.NusNetsID)
            .then(userinfo=> {
	            BookRecord.checkBookingDetail(rid, start, end, d)
				.then(info=> {
					res.render('adminViewDetail.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, info:info, _info: [{groupid:userinfo.groupid, roomid:rid, date:d, start:start, end:end}]});
				})	
            })
			
		}
	})

	app.post('/adminDeleteBookingInfo', isAdminLoggedIn, function(req, res) {
		flash(req);
		console.log(req.body);
		BookRecord.isTimeSlotBookedBy(req.body.rid, 
									  new newDate(Date.parse(req.body.d)).toHyphenString(), 
									  req.body.start, 
									  req.body.end, 
									  req.body.gid)
	    .then(bool=> {
	    	console.log("dateeee: ", new newDate(Date.parse(req.body.d)).toHyphenString());
	    	console.log('postDeleteInfo', bool);
	    	if (bool == true) {
	    		//room is booked by this group, continue
	    		BookRecord.cancelBookingByAdmin("admin", 
										 req.body.rid, 
										 req.body.gid, 
										 new newDate(Date.parse(req.body.d)).toHyphenString(), 
										 req.body.start, 
										 req.body.end)
				.then(resul=> {
					User.getUserInfo(req.user.NusNetsID)
					.then(userinfo=> {
						res.render('adminDeleteBookingInfo.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, detail:req.body});
					})
				})
	    	} else {
	    		//room is not booked by this group, redirect back to info
	    		res.redirect('/adminBookRecord')
	    	}
	    }, null)
	    .catch(err=> {
	        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	        console.error(err);
	        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	    })	
	})

	app.get('/adminShowAllUsers', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			User.getAllUsers()
			.then(info=> {
				res.render('adminShowAllUsers.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, info:info});
			})
		})
	})

	app.get('/adminAddThings', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			res.render('adminAddThings.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}})
		})
	})

	app.post('/manageAdminAddThings', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			if (req.body.itemtype == "Warning") {
				Warning.additionOfWarning([req.body.itemvalue])
				.then(resul=> {
					res.render('manageAdminAddThings.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, itemType: req.body.itemtype, itemValue:req.body.itemvalue});
				})
				.catch(err=> {
					res.redirect('/adminAddThings');
				})
			} else {
				User.addUid(req.body.itemvalue)
				.then(resul=> {
					res.render('manageAdminAddThings.ejs',{profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, itemType: req.body.itemtype, itemValue:req.body.itemvalue});
				})
				.catch(err=> {
					console.log(err);
					res.redirect('/adminAddThings');
				})
			}	
		})
		
	})

	app.get('/adminRemoveUser', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			User.getAllUsers()
			.then(info=> {
				res.render('adminRemoveUser.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, info:info})					
			})
		})
	})

	app.post('/manageAdminRemoveUser', isAdminLoggedIn, function(req, res) {
		flash(req);
		mailer.formatEmailArrayFromReqBody(JSON.parse(JSON.stringify(req.body)))
		.then(useridArr=> {
			User.getUserInfo(req.user.NusNetsID)
			.then(userinfo=> {
				User.removeUidArr(useridArr)
				.then(bool=> {
					res.render('manageAdminRemoveUser.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, useridArr:useridArr})
				})
				.catch(err=> {
					console.log(err);
					res.redirect('/adminRemoveUser');
				})	
			})
		})
	})

	app.get('/adminNotify', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			User.getAllActiveUsers()
			.then(info=> {
				res.render('adminNotify.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, info:info});
			})
		})
	})

	app.post('/manageAdminNotify', isAdminLoggedIn, function(req, res) {
		console.log(req.body);
		//{ '0': 'e0052753@u.nus.edu', subject: 'hello', body: 'test' }
		mailer.formatEmailArrayFromReqBody(JSON.parse(JSON.stringify(req.body)))
		.then(recipientArr=> {
			mailer.sendEmailTo(req.body.body, req.body.subject, recipientArr)
			.then(resul=> {
				User.getUserInfo(req.user.NusNetsID)
				.then(userinfo=> {
					res.render('manageAdminNotify.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, recipientArr:recipientArr});					
				})
			})
		})
	})

	app.get('/adminIssueWarning', isAdminLoggedIn, function(req, res) {
		flash(req);
		User.getUserInfo(req.user.NusNetsID)
		.then(userinfo=> {
			User.getAllActiveUsers()
			.then(info=> {
				Warning.listOfWarnings()
				.then(warnings=> {
					res.render('adminIssueWarning.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, info:info, list:warnings})					
				})
			})
		})
	})	

	app.post('/manageAdminIssueWarning', isAdminLoggedIn, function(req, res) {
		flash(req);
		console.log(JSON.stringify(req.body));
		console.log("req.body.warningtype: ", JSON.stringify(req.body.warningtype));
		GroupWarning.issueWarning(req.body.userid,
								  parseInt(req.body.warningtype),
								  req.body.detail,
								  parseInt(req.body.offendergroupid),
								  req.body.offendername,
								  req.body.offenderuserid,
								  req.body.date,
								  req.body.start,
								  req.body.end)
		.then(resul=> {
			User.getMembersEmail(parseInt(req.body.offendergroupid))
			.then(recipientArr=> {
				Warning.findWarningByType(parseInt(req.body.warningtype))
				.then(warnings=> {
					mailer.sendReportTo(mailer.formatHTMLReport("secret", 
											warnings,
										    req.body.detail, 
										    parseInt(req.body.offendergroupid), 
										    req.body.offendername, 
										    req.body.date, 
										    req.body.start, 
										    req.body.end),
									    recipientArr)
					.then(resul=> {
						User.getUserInfo(req.user.NusNetsID)
						.then(userinfo=> {
						res.render('manageAdminIssueWarning.ejs', {profile: {displayName:userinfo.name, NusNetsID:userinfo.uid, groupid:userinfo.groupid}, groupid: userinfo.groupid, recipientArr:recipientArr})							
						})
					})	
				})
			})
			.catch(err=> {
				console.log(err);
				res.redirect('/adminIssueWarning');
			})
		})
		.catch(err=> {
			console.log(err);
			res.redirect('/adminIssueWarning');
		})
	})
}