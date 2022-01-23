const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGODB_URI
const DATABASE = 'DreamDb'
const bcrypt = require('bcrypt')
const favicon = require('serve-favicon')
const collection = 'Users'

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true}))

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'}) // Expires in 30 min
}

function generateRefreshToken(user) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'}) // Expires after 1 year
}

const customersRoutes = require('./routes/api/customersController')
app.use('/api/customers', customersRoutes)

const usersRoutes = require('./routes/api/usersController')
app.use('/api/users', usersRoutes)

// API Login
app.post('/api/login', (req, res) => {
   // only given values username&password in req.body
  const username = req.body.username
  const password = req.body.password

  console.log('username given : ', username)

  // Get user by the given username
  MongoClient.connect(uri, function(err, client)
  {
    if(err) console.log('ERROR detected, body : ' + req.body + ' / error code : ' + err)
    var users = client.db(DATABASE).collection(collection)

    users.findOne({username: username}, (err, user) => {
      if(err) {
        console.log('ERROR detected during findOne : ', err)
        return
      }
      console.log('user found inside : ',user)
      client.close() // Db close, optional but recommended
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
          res.status(401).send('Incorrect Password ('+req.body.password+')')
          return
        }
      })
    })
  })
})

/* Api Login bis
app.post('/api/login', (req, res) => {
  const profile = req.body.user
  if (!profile) {
    console.log('Unknown user')
    res.status(401).send('Unknown user')
    return
  } else {
    console.log('index.js server profile : ', profile)
  }
  // Check username
  if (req.body.username !== profile.username) {
    res.status(401).send('Unknown username : '+profile.username)
    return
  }
  // Check password
  bcrypt.compare(req.body.password, profile.password, function(err, rez) {
    if (err){
      console.log('index.js server #1 err : ', err)
    }
    if (rez) {
      const accessToken = generateAccessToken(profile)
      const refreshToken = generateRefreshToken(profile)
      const baseResult = {
        accessToken,
        refreshToken,
      }
      const result = { ...baseResult, ...profile } // Merge Token and Connected User data
      res.status(200).send(result)
    } else {
      res.status(401).send('Incorrect Password ('+req.body.password+')')
      return
    }
  })
}) */

// Refresh connection thanks to refresh Token
app.post('/api/refreshToken', (req, res) => {
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

app.use(favicon(__dirname + '/favicon.ico'));

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
