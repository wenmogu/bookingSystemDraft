const User = require('../models/user');
var flash = require('./flash');
var config = require('../config');

var warningLimit = config.warningLimit;
 

module.exports = function(req, res, next) {
    if(req.isAuthenticated()) {
        flash(req);
        // for debugging
        User.isUserInDB(req.user.NusNetsID)
        .then(boo => {
            if (boo == true) {
                User.getUserGroupId(req.user.NusNetsID)
                .then(gid=> {
                    if (gid == null) {
                        return next();
                    } else {
                        User.getGroupWarning(req.user.NusNetsID)
                        .then(num=> {
                            console.log("warning", num);
                            if (num < warningLimit) {
                                return next();
                            } else {
                                res.redirect('/warning?userid=' + req.user.NusNetsID);
                                throw("redirected to warning page");
                            }
                        }, null)        
                    }
                })  
            } else {
            res.redirect('/');
            }
        }, null)
    } else {
        res.redirect('/');
    }
}

