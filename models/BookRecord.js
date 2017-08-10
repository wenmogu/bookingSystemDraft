const {Model} = require('objection');
const Zu = require('./zu');
const Token = require('./token');
const Room = require('./room');

const newDate = require('../api/date-methods');
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

class BookRecord extends Model {
/*--------------------------------schema checked against when creating instances of User--------------------------------------*/
	static get tableName() {
		return 'BookRecord';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['roomid','groupid', 'date', 'start', 'end'],
			properties: {
				roomid: {type: ['integer']},
				groupid: {type: ['integer']},
				date: {type: ['date']},
				start: {type: ['time']},
				end: {type: ['time']}

			}
		};
	}

	static makeBooking(rid, gid, d, start, end) {//101, 1, '2017-7-8', '2:00:00', '4:00:00'
		return BookRecord.query().insert({roomid:rid, groupid:gid, date: d, start:start, end:end});
	}

	static cancelBooking(rid, gid, d, start, end) {//101, 1, '2017-7-8', '2:00:00', '4:00:00'
		return BookRecord.query().delete().where({roomid:rid, groupid:gid, date: d, start:start, end:end});
	}

	static numberOfBookingByAGroupOnDay(rid, gid, d) {//101, 1, '2017-7-8'
		return Promise.resolve(BookRecord.query().count('groupid').where({roomid:rid, date:d, groupid:gid}))
		.then(resul=> {
			console.log(resul);
			return Promise.resolve(resul[0]['count(`groupid`)']);
		}, err=> {
			console.error(err);
		})
	}

	static BookingByAGroupOnDay(gid, d) {
		console.log(d);
		return BookRecord.query().where({groupid:gid, date:d});
	}

	static BookingByAGroupInPastNDays(gid, n, emptyarr) {
		if (n > -1) {
			var lala = new newDate();
			console.log(lala.addDays(-n).toHyphenString());
			return Promise.resolve(BookRecord.query().where({groupid:gid, date:lala.addDays(-n).toHyphenString()}))
			.then(resul=> {
				return BookRecord.BookingByAGroupInPastNDays(gid, n-1, emptyarr.concat([resul]));
			})	
		} else {
			return Promise.resolve(emptyarr);
			//ignore the date in the returned mysql object.It's always one day slower.
			//n = 1
			// [[	{"roomid":101,"groupid":1,"date":"2017-08-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
			// 	{"roomid":101,"groupid":1,"date":"2017-08-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"}	],
			// [	{"roomid":101,"groupid":1,"date":"2017-08-08T16:00:00.000Z","start":"02:00:00","end":"04:00:00"}	]]
		}
	}

	static BookingByAGroupInNextNDays(gid, n, emptyarr) {
		if (n > -1) {
			var lala =  new newDate();
			console.log(lala.addDays(n).toHyphenString());
			return Promise.resolve(BookRecord.query().where({groupid:gid, date:lala.addDays(n).toHyphenString()}))
			.then(resul=> {
				return BookRecord.BookingByAGroupInNextNDays(gid, n-1, emptyarr.concat([resul]));
			})	
		} else {
			return Promise.resolve(emptyarr);
			//n = 4, run on 10th; so, ignore the date in the returned mysql object.It's always one day slower.
			// 2017-8-14
			// 2017-8-13
			// 2017-8-12
			// 2017-8-11
			// 2017-8-10
			// [[],
			// [],
			// [],
			// [{"roomid":101,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"04:00:00","end":"06:00:00"},{"roomid":101,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"04:00:00","end":"06:00:00"},{"roomid":101,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"06:00:00","end":"08:00:00"}],
			// [{"roomid":101,"groupid":1,"date":"2017-08-09T16:00:00.000Z","start":"04:00:00","end":"06:00:00"}]]		}
		}
	}

	static BookingByAllGroupsOnDayOnSlotOnRoom(d, start, rid) {
		return BookRecord.query().where({date:d, start:start, roomid:rid})
		.then(resul => {
			return Promise.resolve(resul);
			//resul.length = 0 or other numbers
		})
	}

	// static BookingByAllGroupsOnDayOnSlot(d, start) {
	// 	var emptyarr = [];
	// 	var allRooms;
	// 	return Room.allRoomNumber()
	// 	.then(resul=> {
	// 		allRooms = resul;
	// 	})
	// 	.then(()=> {
	// 		function helper(count) {
	// 			if (count < allRooms.length) {
	// 				return BookRecord.BookingByAllGroupsOnDayOnSlotOnRoom(d, start, allRooms[count].rid)
	// 				.then(resul => {
	// 					emptyarr.push(resul);
	// 				})
	// 				.then(()=> {
	// 					return helper(count + 1);
	// 				})
	// 			} else {
	// 				return Promise.resolve(emptyarr);
	// 			}
	// 		}
	// 		return helper(0);
	// 	})

	// }

	static BookingByAllGroupsOnDayOnRoom(d, roomid, startarr) {
		var emptyarr = [];
		function helper(count) {
			if (count < startarr.length - 1) {
				return BookRecord.BookingByAllGroupsOnDayOnSlotOnRoom(d, startarr[count], roomid)
				.then(resul => {
					emptyarr.push(resul);
				})
				.then(() => {
					return helper(count + 1);
				})
			} else {
				return Promise.resolve(emptyarr);
			}
		}
		return helper(0);
	}

	static BookingByAllGroupsOnDay(d, startarr) {
		var emptyarr = [];
		var allRooms;
		return Room.allRoomNumber()
		.then(resul=> {
			allRooms = resul;
		})
		.then(()=> {
			function helper(count) {
				if (count < allRooms.length) {
					return BookRecord.BookingByAllGroupsOnDayOnRoom(d, allRooms[count].rid, startarr)
					.then(resul => {
						emptyarr.push(resul);
					})
					.then(()=> {
						return helper(count + 1);
					})
				} else {
					return Promise.resolve(emptyarr);
				}
			}
			return helper(0);
		})
	}

	// static BookingByAllGroupsOnDay(d, startarr) {
	// 	var emptyarr = [];
	// 	function helper(count) {
	// 		if (count < startarr.length - 1) {
	// 			return BookRecord.BookingByAllGroupsOnDayOnSlot(d, startarr[count])
	// 			.then(resul=> {
	// 				emptyarr.push(resul);
	// 			})
	// 			.then(()=> {
	// 				return helper(count + 1);
	// 			})
	// 		} else {
	// 			return Promise.resolve(emptyarr);
	// 		}
	// 	}
	// 	return helper(0);
	// }

	static BookingByAllGroupsInNextNDays(n, nslots) {
		var emptyarr = [];
		var datearr = newDate.datesHyphenString(n);
		var startarr = newDate.timeStringArray(6, 0, 0, nslots);
		function helper(count) {
			if (count < datearr.length) {
				return BookRecord.BookingByAllGroupsOnDay(datearr[count], startarr)
				.then(resul=> {
					emptyarr.push(resul);
				})
				.then(()=> {
					return helper(count + 1);
				})
			} else {
				return Promise.resolve(emptyarr);
			}
		}
		return helper(0);
	}

	static isTimeSlotBooked(rid, d, start, end) {
		return BookRecord.query().where({roomid:rid, date:d, start:start, end:end})
		.then(resul=> {
			if (resul.length > 0) {
				return Promise.resolve(true);
			} else {
				return Promise.resolve(false);
			}
		}, err=> {
	 		console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	 		console.error(err);
	 		console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	 	})
	}
}

module.exports = BookRecord