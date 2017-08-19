const {Model} = require('objection');
const Zu = require('./zu');
const Token = require('./token');
var GroupWarning = require('./groupwarning');

class User extends Model {
/*--------------------------------schema checked against when creating instances of User--------------------------------------*/
	static get tableName() {
		return 'User';
	};

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['uid'],
			properties: {
				uid: {type: ['string']},
				name: {type: ['string', null]},
				email: {type: ['string', null]},
				groupid: {type: ['integer', null]}
			}
		};
	}

	static get relationMappings() {
		return {
			group: {
				relation: Model.BelongsToOneRelation,
				modelClass: Zu,
				join: {
					from: 'User.groupid',
					to: 'Zu.gid'
				}
			}, 
			token: {
				relation: Model.HasManyRelation, 
				modelClass: Token,
				join: {
					from: 'User.uid',
					to: 'Token.userid'
				}
			},
			warningSentBy: {
				relation: Model.HasManyRelation,
				modelClass: GroupWarning,
				join: {
					from: 'User.uid',
					to: 'GroupWarning.userid'
				}
			}
		};
	}
/*-------------------------------------------------methods--------------------------------------------------------*/
//the add and remove queries return a promise which returned value is the number of rows modified in the table.
// if the returned no of rows modified is 0, means no action performed.

//admin queries 
	static howManyUsers() {
		//[{"count(`uid`)":1}] //this is not '', but ``
		return User.query().count('uid').then(resul=> {
			return Promise.resolve(resul[0]['count(`uid`)']);
		});
		//User.howManyUsers().then(num => {console.log(num)}); => 2 
	}

	static getAllUsers() {
		return User.query().orderBy('groupid');
	}

	static getAllActiveUsers() {
		return User.query().where('email', '!=', "null");
	}
	
	static addUid(id) {
		return User.query().insert({uid: id});
	}

	static removeUid(id) {
		return User.query().delete().where('uid', id);
	}

	static removeUidArr(uidArr) {
		function helper(count) {
			if (count < uidArr.length) {
				return User.removeUid(uidArr[count])
				.then(resul=> {
					return helper(count + 1);
				})
			} else {
				return Promise.resolve(true);
			}
		}
		return helper(0);
	}

//user queries
/*----------------GET---------------------*/
	//used for checking if the group is full
	static howManyUsersInGroup(gid) {
		return Promise.resolve(User.query().count('uid').where('groupid', gid))
			.then(resul=> {
				//if the group does not exist in user, then the result is 0.
				return Promise.resolve(resul[0]['count(`uid`)']);
				//User.howManyUsersInGroup(3).then(resul => {console.log(resul)}); => 0
			}, err => {
				console.error(err);
			});
	}

	static getUserInfo(id) {
		return User.query().where('uid', id).then(resul=> {
			if (resul.length == 1) {
				return Promise.resolve(resul[0]);
				//{"uid":"e0052753","name":"Wen Xin","email":"e0052753@u.nus.edu","groupid":null}
			} else {
				return Promise.resolve(null);
				//null
			}
		});
	}

	static getUserGroupId(id) {
		return User.query().where('uid', id).then(person => {
			return Promise.resolve(person[0].groupid);
		});
	}

	static getMembersInfo(gid) {
		return User.query().where('groupid', gid).then(resul=> {
			if (resul.length > 0) {
				return Promise.resolve(resul);
			} else {
				return Promise.resolve(null);
			}
		})
	}

	//precondition:gid exist
	static getMembersEmail(gid) {
		var info;
		var emptyarr = [];
		return User.getMembersInfo(gid)
		.then(resul=> {
			info = resul;
		})
		.then(()=> {
			function helper(count) {
				if (count < info.length) {
					emptyarr.push(info[count].email);
					return helper(count + 1);
				} else {
					return Promise.resolve(emptyarr);
				}
			}
			return helper(0);
		})
	}

	static getGroupWarning(uid) {
		return User.getUserGroupId(uid)
		.then(gid=> {
			return Zu.numberOfWarning(gid)
			.then(num=> {
				console.log("user, numberOfWarning: ", num);
				return Promise.resolve(num);
			})
		})
	}

/*----------------AddOrRemove---------------------*/
//if patch resul is 0, that means nothing is modified. 
	static registerUser(id, name, email) {
		return User.query().patch({name:name, email:email}).where('uid', id);
	}

	//precondition: user alr registered
	static createGroup(uid) {
		return Zu.query().insert({warning:0}).then(resul=> {
			console.log(JSON.stringify(resul));
			return User.query().patch({groupid: resul.id}).where('uid', uid);
		});
	}

	//precondition: gid exists in table Group
	static addGroup(id, gid) {
		return User.query().patch({groupid: gid}).where('uid', id);
	}

	static removeGroupidFromUser(id) {
		return User.query().patch({groupid: null}).where('uid', id);
	}

	static removeGroup(gid) {
		return User.getMembersInfo(gid)
		.then(membersInfo=> {
			console.log(JSON.stringify(membersInfo));
			function helper(count) {
				if (count < membersInfo.length) {
					return User.removeGroupidFromUser(membersInfo[count].uid)
					.then(resul=> {
						return helper(count + 1);
					})
				} else {
					return Promise.resolve(true);
				}
			}
			return helper(0);
		})
	}


/*------------TrueOrFalse-------------------------*/
	static isUserInDB(id) {
	 	return User.query().where('uid', id)
	 	.then(resul=> {
	 		if (resul.length > 0) {
	 			return Promise.resolve(true);
	 		} else {
	 			return Promise.resolve(false);
	 		}
	 	}, err=> {
	 		console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
	 		console.error(err);
	 		console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
	 	})
	}

	//precondition: user is in DB
	static hasUserRegistered(id) {
		return User.query().where('uid', id)
		.then(resul=> {
			if(resul[0].name == null) {
				return Promise.resolve(false);
			} else {
				return Promise.resolve(true);
			}
		})
	}
/*-------------Auto-update------------------------*/
	static updateUserEmail(id, email) {
		return User.query().patch({email: email}).where('uid', id);
	}
}

module.exports = User
