const User = require('../models/User');
var flash = require('./flash');
var config = require('../config');

module.exports = function(req, res, next) {
    if(req.isAuthenticated()) {
        flash(req);
        // for debugging
        User.isUserInDB(req.user.NusNetsID)
        .then(boo => {
            if (boo == true) {
                User.getUserGroupId(req.user.NusNetsID)
                .then(gid=> {
                    if (gid == 1) {
                        return next();
                    } else {
                        res.redirect('/');      
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