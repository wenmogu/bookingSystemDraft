const {Model} = require('objection');

class Warning extends Model {

	static get tableName() {
		return 'Warning';
	};

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['warning'],
			properties: {
				warning: {type: 'integer'},
				warningType: {type: 'string'}
			}
		};
	}

	static get relationMappings() {
		const GroupWarning = require('./groupwarning');

		return {
			TypeOfWarning: {
				relation: Model.HasManyRelation,
				modelClass: GroupWarning,
				join: {
					from: 'Warning.warningType',
					to: 'GroupWarning.warningType'
				}
			}
		};
	}
}