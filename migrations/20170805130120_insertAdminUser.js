exports.up = function(knex, Promise) {
  return Promise.all([
  	knex('Zu').insert({gid: 1, warning: 0})
  	.then(resul => {
  		console.log(JSON.stringify(resul));
  		return knex('User')
  			   .insert({uid:'e0052753', name:'Wen Xin', email:'e0052753@u.nus.edu', groupid:1})
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
    knex('Room').insert({rid: 105})

  ])
};

exports.down = function(knex, Promise) {
  
};
