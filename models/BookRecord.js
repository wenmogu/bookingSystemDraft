const {Model} = require('objection');
const Zu = require('./zu');
const Token = require('./token');

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
			//n = 1
			// [[	{"roomid":101,"groupid":1,"date":"2017-08-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
			// 	{"roomid":101,"groupid":1,"date":"2017-08-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"}	],
			// [	{"roomid":101,"groupid":1,"date":"2017-08-08T16:00:00.000Z","start":"02:00:00","end":"04:00:00"}	]]
		}
	}

	static BookingByAGroupInNextNDays(gid, n, emptyarr) {
		if (n > -1) {
			var lala =  new newDate()
			console.log(lala.toHyphenString());
			return Promise.resolve(BookRecord.query().where({groupid:gid, date:lala.addDays(n).toHyphenString()}))
			.then(resul=> {
				return BookRecord.BookingByAGroupInPastNDays(gid, n-1, emptyarr.concat([resul]));
			})	
		} else {
			return Promise.resolve(emptyarr);
			//n = 4
			// [[],
			//  [],
			//  [],
			//  [{"roomid":101,"groupid":1,"date":"2017-08-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},{"roomid":101,"groupid":1,"date":"2017-08-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"}],
			//  [{"roomid":101,"groupid":1,"date":"2017-08-08T16:00:00.000Z","start":"02:00:00","end":"04:00:00"}]]		}
		}
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