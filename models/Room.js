const {Model} = require('objection');
const Zu = require('./zu');


class Room extends Model {
	static get tableName() {
		return 'Room';
	};

	static get jsonSchema() {
		return {
			type: 'object',
			required: [],
			properties: {
				gid: {type: 'integer'}
			}
		};
	}

	static get relationMappings() {
		return {
			bookedBy: {
				relation: Model.HasOneThroughRelation,
				modelclass: Zu,
				join: {
					from: 'Room.rid',
					through: {
						from: 'BookRecord.roomid',
						to: 'BookRecord.groupid'
					},
					to: 'Zu.gid'
				}
			}
		};
	}
}

module.exports = Room