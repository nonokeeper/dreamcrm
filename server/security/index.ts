const jwt = require('jsonwebtoken')

/* Authenticate token */
const authenticateToken = (req) => {
    //console.log('Security index / req Headers : ', req.headers);
    var authHeader = req.headers['authorization'];
    //console.log('Security index / authHeader : ', authHeader);
    var token = authHeader && authHeader.split(' ')[1]; // Bearer Token
    var refreshToken = authHeader && authHeader.split(' ')[2]; // Refresh Token after accessToken
    //console.log('Security index / accessToken & refreshToken : ', token, ' & ', refreshToken);
  
    try {
      var decodedAccess = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      //console.log('Security index / decoded access : ', decodedAccess)
      return true
    } catch (err) {
        try {
          var decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
          //console.log('Security index / decoded refresh : ', decodedRefresh)
          return true
        } catch (err) {
          console.log('Security index / Error when decoding refreshToken')
          return false
        }
    }
}

module.exports = {authenticateToken};