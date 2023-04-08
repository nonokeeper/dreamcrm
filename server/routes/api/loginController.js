const { db, client } = require ('./mongoDB')
const router = require('./router')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGODB_URI

const collection = 'Users'
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'}) // Expires in 30 min
}

function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'}) // Expires after 1 year
}
// API Login
router.post('/login', (req, res) => {
    // only given values username&password in req.body
  const username = req.body.username
  const password = req.body.password
  const resultUserKO = {errorMessage : "User not found"}
  const resultPasswordKO = {errorMessage : "Password incorrect"}
 
  console.log('loginController / post login --> data given : username=', username, ' and password=', password);
 
   // Get user by the given username
   MongoClient.connect(uri, function(err, client)
   {
     if(err) console.log('ERROR detected, body : ' + req.body + ' / error code : ' + err)
     var users = db.collection(collection)
 
     users.findOne({username: username}, (err, user) => {
      if(err) {
        console.log('loginController / post login --> ERROR detected during findOne : ', err)
        return
      }
      console.log('loginController / post login --> user found : ',user)
      client.close() // Db close, optional but recommended
      

      // Check user Found
      if(user) {
        // Check password
        bcrypt.compare(password, user.password, (err, rez) => {
          if (err){
            console.log('index.js server #1 err : ', err)
          }
          if (rez) {
            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)
            const baseResult = {
              accessToken,
              refreshToken,
            }
            const result = { ...baseResult, ...user } // Merge Token and Connected User data
            res.status(200).send(result)
          } else {
            res.status(401).send(resultPasswordKO)
          }
        })
      } else {
        console.log('user not found');
        res.status(401).send(resultUserKO)
      }
     })
   })
});

// Refresh connection thanks to refresh Token
router.post('/api/refreshToken', (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer toto

    if (!token) {
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.sendStatus(401)
        }
        // Delete old values to enable the refresh data writing
        delete user.iat
        delete user.exp

        const refreshToken = generateAccessToken(user)
        console.log('index.js server Refresh Token required')
        res.send({
          accessToken: refreshToken,
        })
        // TODO : check the user still exists and is authorized
        // Not a middleware there so next() is not needed
    })
})

module.exports = router