const {Model} = require('objection');
const User = require('./user');


const randToken = require('rand-token')

class Token extends Model {
	static get tableName() {
		return 'Token';
	};

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['userid', 'token'],
			properties: {
				userid: {type: 'string'},
				email: {type: 'string'},
				token: {type: 'string'}
			}
		};
	}

	static get relationMappings() {
		const User = require('./user');
		return {
			zhuren: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'Token.userid',
					to: 'User.uid'
				}
			}
		};
	}
	// static get relationMappings() {
	// 	return {
	// 		group: {
	// 			relation: Model.BelongsToOneRelation,
	// 			modelClass: Zu,
	// 			join: {
	// 				from: 'User.groupid',
	// 				to: 'Zu.gid'
	// 			}
	// 		}, 
	// 		token: {
	// 			relation: Model.HasManyRelation, 
	// 			modelClass: Token,
	// 			join: {
	// 				from: 'User.uid',
	// 				to: 'Token.userid'
	// 			}
	// 		}
	// 	};
	// }

	static createTokenFor(uid) {
		return Token.query().insert({userid:uid, token:randToken.generate(11)})
		.then(resul=> {
			// console.log(resul);{"userid":"e0032334","token":"5CMoSCzsXQ8","id":0}
			return Promise.resolve(resul.token);
		})
	}
}
module.exports = Token