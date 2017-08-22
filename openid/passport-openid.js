var OpenIDStrategy = require('passport-openid').Strategy;
var config = require('../config');

module.exports = function (passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new OpenIDStrategy({
      returnURL: config.webaddress + '/auth/openid/return',
      realm: config.realm,
      profile: true
    },
    function(identifier, profile, done) {
      console.log("profile: " + JSON.stringify(profile)); //{"displayName":"Wen Xin","emails":[{"value":"e0052753@u.nus.edu"}],"name":{"familyName":"","givenName":""}}
      console.log("identifier: " + identifier); //https://openid.nus.edu.sg/e0052753
      profile.NusNetsID = identifier.split("/")[3];
      return done(null, profile);
    }
  ));
}