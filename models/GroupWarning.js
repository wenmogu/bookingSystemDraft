const {Model} = require('objection');

class GroupWarning extends Model {
/*--------------------------------schema checked against when creating instances of User--------------------------------------*/
	static get tableName() {
		return 'GroupWarning';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['userid','warningType', 'offenderGroupid', 'date', 'start', 'end'],
			properties: {
				userid: {type: ['integer']},
				warningType: {type: ['integer']},
				detail: {type: ['string']},
				offenderGroupid: {type: ['integer']},
				offenderName: {type: ['string']},
				date: {type: ['date']},
				start: {type: ['time']},
				end: {type: ['time']}

			}
		};
	}

	static get relationMappings() {
		const Warning = require('./warning');
		const User = require('./user');
		return {
			TypeOfWarning: {
				relation: Model.BelongsToOneRelation,
				modelClass: Warning,
				join: {
					from: 'Warning.warningType',
					to: 'GroupWarning.warningType'
				}
			}, 
			sender: {
				relation: Model.BelongsToOneRelation,
				modelClass: User,
				join: {
					from: 'GroupWarning.userid',
					to: 'User.uid'
				}
			}
		};
	}

	static getWarningsFromGroupId(gid) {
		return GroupWarning.query().where('groupid', gid);
	}
}

module.exports = GroupWarning;