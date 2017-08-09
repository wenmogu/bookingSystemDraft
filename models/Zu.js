const {Model} = require('objection');
const User = require('./user');
const Room = require('./Room');

class Zu extends Model {

	static get tableName() {
		return 'Zu';
	};

	static get jsonSchema() {
		return {
			type: 'object',
			required: [],
			properties: {
				gid: {type: 'integer'},
				warning: {type: 'integer'}
			}
		};
	}

	static get relationMappings() {
		return {
			zuyuan: {//lets not use member(censored word lol)
				relation: Model.HasManyRelation,
				modelClass: User,
				join: {
					from: 'Zu.gid',
					to: 'User.groupid'
				}
			}, 
			bookedRoom: {
				relation: Model.HasOneThroughRelation,
				modelClass: Room,
				join: {
					from: 'Zu.gid',
					through: {
						from: 'BookRecord.groupid',
						to: 'BookRecord.roomid'
					},
					to: 'Room.rid'
				}
			}
		};
	}

	static createGroup(uid) {
		return Zu.query().insert({warning:0});
	}

	static removeGroup(gid) {
		return Zu.query().delete().where('gid', gid);
	}

}

module.exports = Zu