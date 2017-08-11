const User = require('../models/user');
var warningLimit = 4;


module.exports = function(req, res, next) {
    if(req.isAuthenticated()) {
        User.isUserInDB(req.user.NusNetsID)
        .then(boo => {
            if (boo == true) {
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
            } else {
            res.redirect('/');
            }
        }, null)
    } else {
        res.redirect('/');
    }
}