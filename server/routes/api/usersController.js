const express = require('express')
const router = express.Router()
const mongodb = require('mongodb')
const { db } = require ('./mongoDB');
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGODB_URI
const DATABASE = 'DreamDb'
const collection = 'Users'
const bcrypt = require('bcrypt')
const saltRounds = 10
//const jwt = require('jsonwebtoken')
const { authenticateToken } = require ('../../security/index.ts');

// Get Users Data
router.get('/', (req,res) => {
  if (authenticateToken(req)) {
    MongoClient.connect(uri, function(err, client)
    {
      if(err) console.log('ERROR detected, body : ' + req.body + ' / error code : ' + err)
      console.log('usersController / get users --> MongoDB connected')
      var users = client.db(DATABASE).collection(collection)
      users.find({}).toArray(function(err, docs)
        {
          if(err) console.log(err)
          client.close() // Db close, optional but recommended
          res.send(docs)
        })
      console.log('users : ', users)
    })
  } else {
    res.statusMessage = 'Forbidden --> bad JWT given!'
    res.sendStatus(403)
  }
  
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
router.get('/:id', async(req, res) => {
  console.log('get by Id');
  
  if (!req.params.id || !mongodb.ObjectId.isValid(req.params.id)) res.status(400).send('User ID Unknown')
  else {
    const user = await db.collection(collection).findOne({_id: new mongodb.ObjectId(req.params.id)})
    console.log('user : ', JSON.stringify(user));
    res.send(user);
    /*
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
    */
  }
})

// Get User data by username
router.get('/username/:username', (req, res) => {
  console.log('get by username')
  if (!req.params.username) res.status(400).send('Username is missing')
  else {
    MongoClient.connect(uri, async (err, client) =>
    {
      if (err) console.log('usersController Error : ' + JSON.stringify(err))
      var users = client.db(DATABASE).collection(collection);
      var user = await users.findOne({username: req.params.username});
      res.send(user);
      console.log('User : ',user);
      client.close();
    })
  }
})

module.exports = router