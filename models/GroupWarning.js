const {Model} = require('objection');

class GroupWarning extends Model {
/*--------------------------------schema checked against when creating instances of User--------------------------------------*/
	static get tableName() {
		return 'GroupWarning';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['userid', 'warningType', 'date', 'start', 'end'],
			properties: {
				userid: {type: ['string']},
				warningType: {type: ['integer']},
				detail: {type: ['string', null]},
				offenderGroupid: {type: ['integer', null]},
				offenderName: {type: ['string', null]},
				offenderUserId: {type: ['string', null]},
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
			reporter: {
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
		return GroupWarning.query().where('offenderGroupid', gid);
	}

	static issueWarning(userid, warningType, detail, offenderGroupid, offenderName, offenderUserId, date, start, end) {
		return GroupWarning.query().insert({'userid': userid, 'warningType':warningType, 'detail': detail, 'offenderGroupid':offenderGroupid, 'offenderName':offenderName, 'offenderUserId': offenderUserId, 'date':date, 'start':start, 'end':end});
	}

	static getWarningFromWarningType(type) {
		return GroupWarning.query().where('warningType', type);
	}
}

module.exports = GroupWarning;