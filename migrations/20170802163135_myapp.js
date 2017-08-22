
exports.up = function(knex, Promise) {
  return Promise.all([

        //lets use chinese, since Group is a keyword in mysql T_T
        knex.schema.createTable('Zu', function(table){
            table.increments('gid').primary();
            table.integer('warning').notNullable().defaultTo(0);
        }),


  		  knex.schema.createTable('Room', function(table){
            table.increments('rid').primary();
        }),

        //for users the idea is that all the ids of potential users will be stored first
        //and the rest of the columns r null. Once they acknowledge they want to use the system
        //add their name and email
        //and once they join a group, add in gid. 
        knex.schema.createTable('User', function(table) {//admins is in the first group ever. id = 0.
            table.string('uid').primary();
            table.string('name').nullable();
            table.string('email').nullable();
            table.integer('groupid').unsigned().nullable().references('gid').inTable('Zu');
        }),

        knex.schema.createTable('BookRecord', function(table) {
        	table.integer('roomid').unsigned().notNullable().references('rid').inTable('Room');
        	table.integer('groupid').unsigned().notNullable().references('gid').inTable('Zu');
        	table.date('date').notNullable();
        	table.time('start').notNullable();
        	table.time('end').notNullable();
        }),

        knex.schema.createTable('Token', function(table) {
        	table.string('userid').references('uid').inTable('User');
        	table.integer('groupid').unsigned().notNullable().references('gid').inTable('Zu');
        	table.string('token').notNullable();
        }), 

        knex.schema.createTable('Warning', function(table) {
          table.string('warning').notNullable();
          table.increments('warningType').primary();
        }),

        knex.schema.createTable('GroupWarning', function(table) {
          table.string('userid').notNullable();
          table.integer('warningType').unsigned().notNullable().references('warningType').inTable('Warning');
          table.string('detail').nullable();
          table.integer('offenderGroupid').unsigned().nullable();
          table.string('offenderName').nullable();
          table.string('offenderUserId').nullable();
          table.date('date').notNullable();
          table.time('start').notNullable();
          table.time('end').notNullable();
        })
    ])

};

exports.down = function(knex, Promise) {
  return Promise.all([
  	knex.schema.dropTableIfExists('BookRecord'),
  	knex.schema.dropTableIfExists('Token'),
    knex.schema.dropTableIfExists('GroupWarning'),
  	//in specific order: the ones contain the foreign keys r dropped later
  	
    knex.schema.dropTableIfExists('Warning'),
  	knex.schema.dropTableIfExists('User'),
    knex.schema.dropTableIfExists('Zu'),
  	knex.schema.dropTableIfExists('Room')
  ])
};
