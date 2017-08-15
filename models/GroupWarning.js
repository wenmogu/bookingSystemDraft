class GroupWarning extends Model {
/*--------------------------------schema checked against when creating instances of User--------------------------------------*/
	static get tableName() {
		return 'GroupWarning';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['groupid','warningType', 'detail', 'offenderGroupid', 'offenderName', 'date', 'start', 'end'],
			properties: {
				groupid: {type: ['integer']},
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
		const Zu = require('./zu');
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
				modelClass: Zu,
				join: {
					from: 'Warning.groupid',
					to: 'Zu.gid'
				}
			}
		};
	}
}