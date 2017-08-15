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
		const User = require('./user');
		const Room = require('./Room');
		const GroupWarning = require('./GroupWarning')
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
			}, 
			warningSentBy: {
				relation: Model.HasManyRelation,
				modelClass: GroupWarning,
				join: {
					from: 'Zu.gid',
					to: 'GroupWarning.groupid'
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

	static numberOfWarning(gid) {
		return Zu.query().where({gid:gid})
		.then(resul=> {
			console.log("at group, ", JSON.stringify(resul));
			console.log("at group, number of warning: ", resul[0].warning);
			if (resul.length == 0) {
				return Promise.resolve(0);
			} else {
				return Promise.resolve(resul[0].warning);
			}
		})
	}

}

module.exports = Zu