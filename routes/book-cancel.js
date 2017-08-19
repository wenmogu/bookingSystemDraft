const User = require('../models/user');
const BookRecord = require('../models/bookrecord');

var config = require('../config');
var bookingLimit = config.bookingLimit;
 


module.exports = {
	//for ifGroupFull in control in /booking
	bookForm: function(req, res, rid, d, start, end, gid, userinfo) {
	    BookRecord.isTimeSlotBooked(rid, d, start, end)
	    .then(bool=> {
	    	if (bool == false) {
	    		//room is not booked by any group, continue
	    		BookRecord.numberOfBookingByAGroupOnDay(gid, d)
	    		.then(num => {
	    			if (gid != 1 && num > bookingLimit) {//excluding the admin group
	    				// cannot book, alert and redirect to viewbooking
	    				res.redirect('/viewBooking')
	    				throw('cannot book, alert and redirect to viewbooking');
	    			} else {
	    				res.render('booking.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid}, groupid:gid, roomid:rid, date:d, start:start, end:end});
	    			}
	    		}, null)
	    	} else {
	    		//room is booked by some group, redirect back to info
	    		res.redirect('/info')
	    		throw('room is not booked by this group, redirect back to info');
	    	}
	    }, null)
	    .catch(err=> {
	        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	        console.error(err);
	        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	    })
	}
	,
	cancelForm: function(req, res, rid, d, start, end, gid, userinfo) {
	    BookRecord.isTimeSlotBookedBy(rid, d, start, end, gid)
	    .then(bool=> {
	    	if (bool == true) {
	    		//room is booked by this group, continue
				res.render('cancelBooking.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid}, groupid:gid, roomid:rid, date:d, start:start, end:end});
	    	} else {
	    		//room is not booked by this group, redirect back to viewBooking
	    		res.redirect('/viewBooking')
	    		throw('room is not booked by this group, redirect back to viewBooking');
	    	}
	    }, null)
	    .catch(err=> {
	        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	        console.error(err);
	        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	    })
	}
	,
	manageBooking: function(req, res, rid, d, start, end, gid, userinfo) {
		BookRecord.isTimeSlotBooked(rid, d, start, end)
	    .then(bool=> {
	    	if (bool == false) {
	    		//room is not booked by any group, continue
	    		BookRecord.makeBooking(userinfo.name, rid, gid, d, start, end)
				.then(()=> {
					res.render('manageBooking.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid}, groupid:gid, roomid:rid, date:d, start:start, end:end});
				})
	    	} else {
	    		//room is booked by some group, redirect back to info
	    		res.redirect('/info')
	    	}
	    }, null)
	    .catch(err=> {
	        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	        console.error(err);
	        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	    })
	} 
	,
	manageCancel: function(req, res, rid, d, start, end, gid, userinfo) {
		BookRecord.isTimeSlotBookedBy(rid, d, start, end, gid)
	    .then(bool=> {
	    	if (bool == true) {
	    		//room is booked by this group, continue
	    		BookRecord.cancelBooking(userinfo.name, rid, gid, d, start, end)
				.then(()=> {
					res.render('manageCancel.ejs', {profile:{displayName:userinfo.name, NusNetsID:userinfo.uid}, groupid:gid, roomid:rid, date:d, start:start, end:end});
				})
	    	} else {
	    		//room is not booked by this group, redirect back to info
	    		res.redirect('/viewBooking')
	    	}
	    }, null)
	    .catch(err=> {
	        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	        console.error(err);
	        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	    })
	}
}