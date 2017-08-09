const User = require('../models/user');
var limit = 1;

function control(req, res, ifGroupFull, ifGroupNotFull, ifNotInGroup, ifNotRegistered) {
//all the if params r functions; the first two with groupid as argument
    User.isUserInDB(req.user.NusNetsID)
    .then(boo=> {
        if (boo == true) {
            //user in DB
            return Promise.resolve(true);
        } else {
            //user hasnt registered
            ifNotRegistered();
            throw("user hasnt registered");s
        }
    })
    .then(boo => {
      //update user email
        if (boo == true) {
            User.updateUserEmail(req.user.NusNetsID, req.user.emails[0].value);
        }
    })
    .then(() => {
        User.getUserGroupId(req.user.NusNetsID)
        .then(gid => {
            if (gid == null || gid == undefined) {
            //user does not hv a group
                ifNotInGroup();
                throw("user does not hv a group");
            } else {
            //user in a group, check if the group is full
                User.howManyUsersInGroup(gid)
                .then(num=> {
                    if (num >= limit) {
                    //group is allowed to make booking
                        ifGroupFull(gid);
                    } else {
                    //group is not allowed to make booking. invite more members
                        ifGroupNotFull(gid);
                        throw("group is not allowed to make booking. invite more members")
                    }
                }, null)
            }
        }, null)
    }).catch(err => {
        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
        console.error(err);
        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
    })
}
module.exports = control;