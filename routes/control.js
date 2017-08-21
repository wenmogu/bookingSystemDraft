const User = require('../models/User');

var config = require('../config');
var limit = config.limit;
 
function control(req, res, ifGroupFull, ifGroupNotFull, ifNotInGroup, ifNotRegistered) {
//all the if params r functions; the first two with groupid as argument   
// first three have userinfo as argument    
    User.hasUserRegistered(req.user.NusNetsID)
    .then(bool=> {
        if (bool == false) {
            //user hasnt registered
            ifNotRegistered();
            throw("user hasnt registered");        
        } else {
            return Promise.resolve(true);
        }
    })
    .then(boo => {
      //update user email
        if (boo == true) {
            if (req.user.emails[0].value != "") {
                User.updateUserEmail(req.user.NusNetsID, req.user.emails[0].value)
                .then(resul=> {
                    ;
                });
            } else {
                //as NUS Openid sometimes will not pass in the correct email value
                ;
            }
        }
    })
    .then(() => {
        User.getUserInfo(req.user.NusNetsID)
        .then(userinfo=> {
            User.getUserGroupId(req.user.NusNetsID)
            .then(gid => {
                if (gid == null || gid == undefined) {
                //user does not hv a group
                    ifNotInGroup(userinfo);
                    throw("user does not hv a group");
                } else {
                //user in a group, check if the group is full
                    User.howManyUsersInGroup(gid)
                    .then(num=> {
                        if (num >= limit) {
                        //group is allowed to make booking
                            ifGroupFull(gid, userinfo);
                        } else {
                        //group is not allowed to make booking. invite more members
                            ifGroupNotFull(gid, userinfo);
                            throw("group is not allowed to make booking. invite more members")
                        }
                    }, null)
                    .catch(err=>{;});
                }
            }, null)
            .catch(err=>{;})
        }, null)
        .catch(err=>{;});
    }).catch(err => {
        console.log("OMGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
        console.error(err);
        console.log("ERRORRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
    })
}
module.exports = control;