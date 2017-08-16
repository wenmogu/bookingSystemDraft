var adminDetails = require('../passwords');

exports.up = function(knex, Promise) {
  return Promise.all([
  	knex('Zu').insert({gid: 1, warning: 0})
  	.then(resul => {
  		console.log(JSON.stringify(resul));
  		return knex('User')
  			   .insert({uid:adminDetails.uid, name:adminDetails.name, email:adminDetails.name, groupid:1})
  			   .then(inserted => {
  			   	console.log(inserted);
  			   }, errr => {
  			   	console.log(errr);
  			   })
  	}, err=> {
  		console.log(err);
  	}),

    knex('Room').insert({rid: 100}),
    knex('Room').insert({rid: 101}),
    knex('Room').insert({rid: 102}),
    knex('Room').insert({rid: 103}),
    knex('Room').insert({rid: 104}),
    knex('Room').insert({rid: 105}),

    knex('Warning').insert({warning: 'Abusive use of room and facilities'}),
    knex('Warning').insert({warning: 'Occupying room at someone else\'s timeslot'}),
    knex('Warning').insert({warning: 'Unfunctional Facilities'}),
    knex('Warning').insert({warning: 'Room is not utilized (e.g. booked but no one is inside'}), 
    knex('Warning').insert({warning: 'Using the room without booking'}),
    knex('Warning').insert({warning: 'Eating/drinking in the room'})
  ])
};

exports.down = function(knex, Promise) {
  
};
