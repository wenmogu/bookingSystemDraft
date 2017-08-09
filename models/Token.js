const {Model} = require('objection');

class Token extends Model {
	static get tableName() {
		return 'Token';
	};

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['userid', 'email', 'token'],
			properties: {
				userid: {type: 'string'},
				email: {type: 'string'},
				token: {type: 'string'}
			}
		};
	}

	static get relationMappings() {
		const User = require('./User');
		return {
			Owner: {
				relation: Model.BelongToOneRelation,
				modelClass: User,
				join: {
					from: 'Token.userid',
					to: 'User.uid'
				}
			}
		};
	}
}
module.exports = Token