const User = require('../models/User');
const Zu = require('../models/Zu');
const BookRecord = require('../models/bookrecord');
const Token = require('../models/token');
const newDate = require('./date-methods');
const Room = require('../models/room');

const mailer = require('./mailer');

const {Model} = require('objection');
const Knex = require('knex');
const knexConfig = require('../knexfile');

const knex = Knex(knexConfig.development);

Model.knex(knex);

// Date.prototype.addDays = function(days) {
//     var dat = new Date(this.valueOf());
//     dat.setDate(dat.getDate() + days);
//     return dat;
// }

// Date.prototype.toHyphenString = function() {
// 	// console.log("whats this: ", JSON.stringify(this));
// 	var dat = new Date(this.valueOf());
// 	var arr = dat.toLocaleDateString().split('/');
// 	var ar = [];
// 	ar[0] = arr[2];
// 	ar[1] = arr[0];
// 	ar[2] = arr[1];
// 	var str = ar.join('-');
// 	return str;
// }


// User.addUid('e0032334').then(resul => {console.log(JSON.stringify(resul))}, err=>{console.error(err)});
// User.howManyUsers().then(num => {console.log("asfsdf" + num)}); 

//User.removeGroup('e0052753', 4).then(resul=> {console.log(JSON.stringify(resul))});
// User.removeGroup('e0052753').then(resul=>{console.log(resul)});
// User.removeUid('e0052755').then(resul=>{console.log(resul)});
// User.getUserInfo('e0052753').then(resul=>{console.log(JSON.stringify(resul))});
// User.getMembersInfo(4).then(resul=>{console.log(resul)});

// User.addUid('e0052755').then(resul=>{console.log(resul)}).then(null, err=>{console.error(err)});
// User.getUserInfo('e0052752').then(resul=>{console.log(resul)});
// Zu.removeGroup(1).then(resul=>{console.log(resul)});

// date.addDays(3);

// User.isUserInDB('e0052751')
// 		.then(boo=> {
// 			console.log("checking if in DB: ", boo);
// 			if (boo == true) {
// 				return Promise.resolve(true);
// 			} else {
// 				console.log("not in DB, doing nothing");
// 				throw("im done");
// 			}
// 		})
// 		.then(boo => {
// 			console.log('checking email' + boo);
// 			if (boo == true) {
// 				console.log('user in DB. updating email');
// 				User.updateUserEmail('e0052751', 'e0052753@u.nus.edu').then(resul => {
// 					console.log(resul);
// 				});
// 			} 
// 		})
// 		.then(()=> {
// 			console.log('emmm everything is done');
// 			User.getUserGroupId('e0052751');
// 		})
// 		.then(gid => {
// 			console.log(gid);
// 		}, 
// 		err=> {
// 			console.log(err);
// 		})
// User.updateUserEmail('e0052753', 'e0032334@u.nus.edu')
// .then(() => {
// 	User.getUserGroupId('e0052753').then(id=> {
// 		console.log("im here, ", id);
// 	})
// }).then(id=> {
// 		console.log('lolol', id);
// 	})

// var lala = new newDate().addDays(0);

// BookRecord.makeBooking(102, 1, lala.toHyphenString(), '14:00:00', '16:00:00').then(resul=>{
// 	console.log(resul);
// })
// BookRecord.makeBooking(101, 1, lala.toHyphenString(), '12:00:00', '14:00:00').then(resul=>{
// 	console.log(resul);
// })



// BookRecord.BookingByAGroupOnDay(1, lala.toHyphenString()).then(resul=> {
// 	console.log(JSON.stringify(resul));
// })
// [{"roomid":101,"groupid":1,"date":"2017-07-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
// {"roomid":101,"groupid":1,"date":"2017-07-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
// {"roomid":101,"groupid":1,"date":"2017-07-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
// {"roomid":101,"groupid":1,"date":"2017-07-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
// {"roomid":101,"groupid":1,"date":"2017-07-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
// {"roomid":101,"groupid":1,"date":"2017-07-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"},
// {"roomid":101,"groupid":1,"date":"2017-07-07T16:00:00.000Z","start":"02:00:00","end":"04:00:00"}]
// BookRecord.numberOfBookingByAGroupOnDay(101, 1, lala.toHyphenString()).then(resul=> {
// 	console.log(resul);
// })

// BookRecord.isTimeSlotBooked(101, lala.toHyphenString(), '2:00:00', '4:00:00').then(resul=> {
// 	console.log(resul);
// })
// BookRecord.BookingByAllGroupsInNextNDays(4, []).then(resul=>{
// 	console.log(JSON.stringify(resul));
// })

// var lala = new newDate();

// console.log(newDate.timeStringArray(6, 0, 0, 8));

// User.isUserInDB(undefined)
//     .then(resul=> {
//     	console.log(resul);
//     })

// Room.allRoomNumber().then(resul=> {console.log(resul)});

// BookRecord.BookingByAllGroupsOnDay('2017-8-11', newDate.timeStringArray(0, 0, 0, 9)).then(resul => {
// 	console.log(JSON.stringify(resul))
// });
// [	
// 	[],
// 	[{"roomid":101,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"04:00:00","end":"06:00:00"},
// 	{"roomid":101,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"04:00:00","end":"06:00:00"}],
// 	[{"roomid":101,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"06:00:00","end":"08:00:00"},
// 	{"roomid":100,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"06:00:00","end":"08:00:00"}],
// 	[],
// 	[],
// 	[],
// 	[],
// 	[]
// ]

// BookRecord.BookingByAllGroupsInNextNDays(4, 9).then(resul=> {
// 	console.log(JSON.stringify(resul));
// })
// [
// 	[
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[{"roomid":101,"groupid":1,"date":"2017-08-12T16:00:00.000Z","start":"12:00:00","end":"14:00:00"}],[],[],[],[],[]],
// 		[[],[],[],[{"roomid":102,"groupid":1,"date":"2017-08-12T16:00:00.000Z","start":"14:00:00","end":"16:00:00"}],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[{"roomid":104,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"12:00:00","end":"14:00:00"}],[],[],[],[],[]],
// 		[[],[],[],[{"roomid":105,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"14:00:00","end":"16:00:00"}],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]],
// 		[[],[],[],[],[],[],[],[]]
// 	]
// ]

// [
// 	[
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[{"roomid":101,"groupid":1,"date":"2017-08-12T16:00:00.000Z","start":"12:00:00","end":"14:00:00"}],[],[],[],[]],
// 		[[],[],[{"roomid":102,"groupid":1,"date":"2017-08-12T16:00:00.000Z","start":"14:00:00","end":"16:00:00"}],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[{"roomid":104,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"12:00:00","end":"14:00:00"}],[]],
// 		[[],[],[],[],[],[{"roomid":105,"groupid":1,"date":"2017-08-10T16:00:00.000Z","start":"14:00:00","end":"16:00:00"}]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]]
// 	],
	
// 	[
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]],
// 		[[],[],[],[],[],[]]
// 	]
// ]

// BookRecord.BookingByAllGroupsOnDayOnSlot('2017-8-13', '12:00:00').then(resul=> {
// 	console.log(JSON.stringify(resul));
// })
//[[],[{"roomid":101,"groupid":1,"date":"2017-08-12T16:00:00.000Z","start":"12:00:00","end":"14:00:00"}],[],[],[],[]]

// BookRecord.numberOfBookingByAGroupInNextNDays(1, 5).then(resul=> {
// 	console.log(resul);
// })


// User.getMembersEmail(1).then(resul=> {console.log(resul)});

// mailer.sendEmailTo('text', 'subject', ['e0052753@u.nus.edu']).then(resul=> {console.log(resul)});

// User.addUid('e0032334').then(resul=> {
// 	console.log(resul)
// })

// Token.createTokenFor('e0052753').then(resul=> {
// 	console.log(JSON.stringify(resul));
// })

// BookRecord. makeBooking('e0052753', 101, 1, '2017-8-13', '8:00:00', '10:00:00').then(resul=>{
// 	console.log(resul);
// })

// User.removeGroup(1).then(resul=> {console.log('removeGroup: ', resul)});