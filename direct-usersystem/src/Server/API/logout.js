const mongoose = require('mongoose');

const UserLog = mongoose.model('UserLog');

const requireLogin = require("../HOF/requireLogin");

module.exports = requireLogin(({ res , req }) => {
    const { token , userid } = req.body;
    //delete req.session[token];
    //delete req.session.token;
    delete req.session.logined;
    (new UserLog({
      userid,
      action: "logout",
      detail: "token: " + token,
    })).save();
    res.status( 200 ).end();
});