const express = require('express')
const router = express.Router()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGODB_URI
const DATABASE = 'DreamDb'
const collection = 'Users'
const bcrypt = require('bcrypt')
const saltRounds = 10
var jwt = require('jsonwebtoken')

/* Middleware authentification for routes */
function authenticateToken(req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer Token

  if (!token) { // No bearer token, check connected user tokens
    const accessToken = req.body.state.user.accessToken
    const refreshToken = req.body.state.user.refreshToken
    if (!accessToken) {
      res.status(401).send({auth: false, message: 'Forbidden - no access Token'})
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) {
            console.log('Token invalid, error : ', err)
            res.status(401)
          } else {
            //console.log('OK via refreshToken : ', refreshToken)
            res.status(200).send(user)
          }
        })
      } else {
        //console.log('OK via accessToken : ', accessToken)
        res.status(200).send(user)
      }
    })
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log('usersController.js -- Error : ', err)
        res.status(401).send({auth: false, message: 'Token expired or invalid.'})
      } else res.status(200).send(user)
    })
  }
}

// Post get my infos with authentication
router.post('/me', (req, res) => {
  authenticateToken(req, res)
})

/* Post get my infos
router.post('/me', (req, res) => {
  console.log('post me')
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer Token
  console.log('token : ', token)
  if (token) { // API Call with bearer token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log('usersController.js -- Error : ', err)
        res.status(401).send({auth: false, message: 'Token expired or invalid.'})
      } else res.status(200).send(user)
    })
  }
  else { // Internal call with token from the connected user
    const accessToken = req.body.state.user.accessToken
    const refreshToken = req.body.state.user.refreshToken

    if (!accessToken) {
      res.status(401).send({auth: false, message: 'No Token provided.'})
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) {
            console.log('Token invalid, error : ', err)
            res.status(401).send({auth: false, message: 'Token Invalid.'})
          } else {
            console.log('OK via refreshToken : ', refreshToken)
            res.status(200).send(user)
          }
        })
      } else {
        console.log('OK via accessToken : ', accessToken)
        res.status(200).send(user)
      }
    })
  }
}) */

// Get Users Data
router.get('/', (req,res) => {
  console.log('req.body : ', req.body)
  MongoClient.connect(uri, function(err, client)
  {
    if(err) console.log('ERROR detected, body : ' + req.body + ' / error code : ' + err)
    var users = client.db(DATABASE).collection(collection)
      users.find({}).toArray(function(err, docs)
        {
          if(err) console.log(err)
          client.close() // Db close, optional but recommended
          res.send(docs)
        })
  })
})

// Modify users Meta
router.put('/meta', (req, res) => {
  MongoClient.connect(uri, function(err, client)
  {
    if (err) console.log(err)
    client.db(DATABASE).collection(collectionMeta).updateOne({collectionName: 'Customers'}, { $set: req.body }, function(error, result) {
      if (error) console.log(error)
      client.close() // Db close
      res.status(200).send(result)
    })
  })
})

// Insert one user Metadata
router.post('/meta', (req, res) => {
  // console.log('customersController.js : router.post meta')
  MongoClient.connect(uri, function(err, client)
  {
    if (err) console.log(err)
    var field = ''
    var object = {}
    for (const item in req.body) {
      field = "fields." + item
      object = req.body[item]
    }
    client.db(DATABASE).collection(collectionMeta).updateOne({collectionName: 'Customers'}, { $set: {[field]:object} }, function(error, result) {
      if (error) console.log(error)
      client.close() // Db close
      res.status(200).send(result)
    })
  })
})

// Create a new user
router.post('/', (req, res) => {
  console.log('usersController.js Stringify req.body : ' + JSON.stringify(req.body))

  bcrypt.hash(req.body.password, saltRounds , function(err, hash) {
    if (err) throw err
    req.body.password = hash
    console.log('usersController.js Password hashed : ', req.body.password)
  })

  MongoClient.connect(uri, function(err, client)
  {
    if (err) throw err
    client.db(DATABASE).collection(collection).insertOne(req.body, function(err, result) {
      if (err) {
        client.close() // Db close
        console.log('usersController -- Database error detected : ', err)
        res.status(500).send(err)
        return
      }
      client.close() // Db close
      res.status(201).send(result.insertedId)
    })
  })
})

// Modify an existing user
router.put('/:id', (req, res) => {
  if (!req.params.id) res.status(400).send('Customer ID Unknown')
  MongoClient.connect(uri, function(err, client)
  {
    if (err) console.log(err)
    client.db(DATABASE).collection(collection).updateOne({_id: new mongodb.ObjectId(req.params.id)}, { $set: req.body }, function(error, result) {
      if (error) console.log(error)
      // console.log('Successfully updated :' + JSON.stringify(result))
      client.close() // Db close
      res.status(200).send(result)
    })
  })
})

// Delete a user
router.delete('/:id', (req, res) => {
  if (!req.params.id) res.status(400).send('User ID Unknown')
  MongoClient.connect(uri, function(err, client)
  {
    if (err) console.log(err)
    client.db(DATABASE).collection(collection).deleteOne({_id: new mongodb.ObjectId(req.params.id)}, function(error, result) {
      if (error) console.log(error)
      console.log('Successfully deleted :' + JSON.stringify(result))
      client.close() // Db close
      res.status(200).send('Customer deleted')
    })
  })
})

// Get User data by Id
router.get('/:id', (req, res) => {
  console.log('get by Id')
  if (!req.params.id || !mongodb.ObjectId.isValid(req.params.id)) res.status(400).send('User ID Unknown')
  else {
    MongoClient.connect(uri, (err, client) =>
    {
      if (err) console.log('usersController Error : ' + JSON.stringify(err))
      var users = client.db(DATABASE).collection(collection)
      users.findOne({_id: new mongodb.ObjectId(req.params.id)}, (error, result) => {
        if (error) console.log(error)
        res.send(result)
        console.log('Result : ',result)
        client.close() // Db close
      })
    })
  }
})

module.exports = router