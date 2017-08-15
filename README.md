# bookingSystemDraft
1. create a knexfile.js in root folder, and it looks like this: 

module.exports = {
  development: {
    client:'your client, e.g. mysql',
    connection: {
      host : 'ur host, e.g. localhost',
      user : 'ur user name, e.g. root',
      password : 'ur password',
      database : 'ur database'
    }
  }
}

2. and in the root folder, create a passwords.js, and it looks like this: 

module.exports = {
	user: 'the gmail account (it has to be an admin account) you want to spam others and yourself with',
	password: 'your email password',
  	uid: 'ur nusnets id ',
	name: 'your name',
	email: 'your email, but eventually it will auto-update to ur nus student email'
}

3. install the node modules

4. and install npm knex package globally

5. open a terminal and go to the root folder, run the following command with your client service turned on: 
  knex migrate:latest
  
6. run bin/www

