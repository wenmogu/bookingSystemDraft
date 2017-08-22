const {Model} = require('objection');
const User = require('./User');
const Zu = require('./Zu');


const randToken = require('rand-token')

class Token extends Model {
	static get tableName() {
		return 'Token';
	};

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['userid', 'groupid', 'token'],
			properties: {
				userid: {type: 'string'},
				groupid: {type: 'integer'},
				token: {type: 'string'}
			}
		};
	}

	static get relationMappings() {
		const User = require('./User');
		return {
			zhuren: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'Token.userid',
					to: 'User.uid'
				}
			}, 

			zu: {
				relation: Model.BelongsToOneRelation,
				modelClass: Zu,
				join: {
					from: 'Token.groupid',
					to: 'Zu.gid'
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

	static createTokenFor(uid, gid) {
		return Token.query().insert({userid:uid, groupid:gid, token:randToken.generate(11)})
		.then(resul=> {
			// console.log(resul);{"userid":"e0032334","token":"5CMoSCzsXQ8","id":0}
			return Promise.resolve(resul.token);
		})
	}

	static getGidFromToken(token) {
		return Token.query().where('token', token)
		.then(resul=> {
			if (resul.length == 1) {
				return Promise.resolve(resul[0].groupid);
				// {"userid":"e0052753","token":"5CMoSCzsXQ8","groupid":2}
			} else {
				return Promise.resolve(null);
			}
		})
	}

	static deleteTokenRelatedToUser(uid) {
		return Token.query().delete().where('userid', uid)
		.then(resul=> { 
			return Promise.resolve(true);
		})
	}
}
module.exports = Token