const mongoose = require("mongoose");
const UserAuth = mongoose.model("UserAuth");
const UserLog = mongoose.model("UserLog");

const { certRegExp , passwordRegExp } = require("../../Constant/regExp");

const crypto = require("crypto");

module.exports = ({ res , req }) => {
  var { cert , password } = req.body;
  if( !certRegExp.test( cert ) ||  !passwordRegExp.test( password ) ){
    return res.status( 403 ).end();
  }
  UserAuth.findOne({ cert: cert } , ( err , result ) => {
    if( err ){
      return res.status( 500 ).end();
    }
    if( result ){
      return res.send({
        status: 1
      });
    }
    let hash = crypto.createHash("sha256");
    hash.write( password );
    password = hash.digest("hex");
    const user = new UserAuth({
      userid: new mongoose.Types.ObjectId(),
      cert,
      password
    });
    user.save( err => {
      if( err ){
        return res.status( 500 ).end();
      }
      res.send({
        status: 0
      });
    });
  });
};