const express = require('express')
const router = express.Router()
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGODB_URI
const DATABASE = 'DreamDb'
const collection = 'Customers'
const collectionMeta = 'meta_collections'

// Get Customers Data
router.get('/', function(req,res){
  MongoClient.connect(uri, function(err, client)
  {
    if(err) console.log('ERROR detected, body : ' + req.body + ' / error code : ' + err)
    var customers = client.db(DATABASE).collection(collection)
      customers.find({}).toArray(function(err, docs)
        {
          if(err) console.log(err)
          client.close() // Db close
          res.send(docs)
        })
  })
})

// Get Customers Meta collectionMeta
router.get('/meta', (req, res) => {
  MongoClient.connect(uri, function(err, client)
  {
    if(err) console.log('ERROR detected, body : ' + req.body + ' / error code : ' + err)
    var customersMeta = client.db(DATABASE).collection(collectionMeta)
    customersMeta.find({collectionName:collection}).toArray(function(err, docs)
      {
        if(err) console.log(err)
        client.close() // Db close
        res.send(docs[0].fields)
      })
  })
})

// Modify customers Meta
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

// Insert one customers Meta
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

// Create a customer
router.post('/', (req, res) => {
  // console.log('customersController.js req.body : ' + JSON.stringify(req.body))
  MongoClient.connect(uri, function(err, client)
  {
    client.db(DATABASE).collection(collection).insertOne(req.body, function(err, result) {
      if (err) throw err
      // console.log('Successfully created')
      client.close() // Db close
      res.status(201).send(result.insertedId)
    })
  })
})

// Modify a customer
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

// Delete a customer
router.delete('/:id', (req, res) => {
  if (!req.params.id) res.status(400).send('Customer ID Unknown')
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

// Get Customer by Id
router.get('/:id', (req, res) => {
  if (!req.params.id) res.status(400).send('Customer ID Unknown')
  MongoClient.connect(uri, function(err, client)
  {
    if (err) console.log('Error1 : ' + JSON.stringify(err))
    var customers = client.db(DATABASE).collection(collection)
      customers.findOne({_id: new mongodb.ObjectId(req.params.id)}).then( (feedback) => 
      {
        client.close() // Db close
        res.send(feedback)
      })
  })
})

module.exports = router