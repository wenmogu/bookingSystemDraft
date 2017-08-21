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
				warning: {type: 'string'},
				warningType: {type: 'integer'}
			}
		};
	}

	static get relationMappings() {
		const GroupWarning = require('./GroupWarning');
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

	static additionOfWarning(warningarr) {
		function helper(count) {
			if (count < warningarr.length) {
				return Warning.query().insert({warning: warningarr[count]})
				.then(resul=> {
					return helper(count + 1);
				})
			} else {
				return Promise.resolve(true);
			}
		}
		return helper(0);
	}

	static listOfWarnings() {
		return Warning.query();
	}

	static findWarningByType(type) {
		return Warning.query().where('warningType', type)
		.then(resul=> {
			if (resul.length == 0) {
				return Promise.resolve(null);
			} else {
				return Promise.resolve(resul[0].warning);
			}
		})
	}
}

module.exports = Warning;