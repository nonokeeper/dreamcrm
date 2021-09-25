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
    var customers = client.db(DATABASE).collection(collection)
      customers.find({}).toArray(function(err, docs)
        {
          client.close() // Db close
          res.send(docs)
        })
  })
})

// Get Customers Meta collectionMeta
router.get('/meta', (req, res) => {
  MongoClient.connect(uri, function(err, client)
  {
    var customers = client.db(DATABASE).collection(collectionMeta)
    customers.find({collectionName:collection}).toArray(function(err, docs)
      {
        client.close() // Db close
        res.send(getFields(docs[0].fields))
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
        // if (err) console.log('Error2 : ' + JSON.stringify(err))
        client.close() // Db close
        res.send(feedback)
      })
  })
})

function getFields (data) {
  var fields = []
  var arrayFields = Object.keys(data)
  arrayFields.forEach((value) => {
    var field = value
    var type = data[value].type
    if (type !== 'Object') {
      var label = data[value].en_label
      var required = data[value].required
      if (!required) required = false
      fields.push([value, label, required, type])
    } else {
      var subArrayFields = Object.keys(data[field])
      subArrayFields.forEach((subValue) => {
        var field2 = subValue
        var type2 = data[field][field2].type
        if (field2 !== 'type') {
          var label2 = data[field][field2].en_label
          var required = data[field][field2].required
          if (!required) required = false
          if (type2 !== 'Object') {
            fields.push([value + '.' + subValue, label2, required, type2])
          }
        }
      })
    }
  })
  // console.log('CustomersController.js fields final : ' + fields)
  return fields
}

module.exports = router

// const ObjectID = require('mongoose').Types.ObjectId

/*
const Customer = require('../../models/Customer')
// Get Customer model from Collection metadata


// set defaultModel to variable customerModel
var CustomerModel = Customer.defaultModel

Customer.customerModel().then((data) => {
  CustomerModel = data // set good CustomerModel to variable customerModel
}).catch((err) => { console.log('Error : ' + err) })
*/

/*
async function loadCustomersCollection() {
  try {
    var client = await MongoClient.connect(uri, {useNewUrlParser: true})
    var customers = client.db(DATABASE).collection("Customers")
    return await customers.countDocuments()
  } catch(err) { console.log('Error : ' + err)}
}


function getFields (data) {
  var fields = []
  var arrayFields = Object.keys(data.fields[0])
  arrayFields.forEach((value) => {
    var field = value
    var type = data.fields[0][value].type
    if (type !== 'Object') {
      var label = data.fields[0][value].en_label
      var required = data.fields[0][value].required
      if (!required) required = false
      fields.push([value, label, required, type])
    } else {
      var subArrayFields = Object.keys(data.fields[0][field])
      subArrayFields.forEach((subValue) => {
        var field2 = subValue
        var type2 = data.fields[0][field][field2].type
        if (field2 !== 'type') {
          var label2 = data.fields[0][field][field2].en_label
          var required = data.fields[0][field][field2].required
          if (!required) required = false
          if (type2 !== 'Object') {
            fields.push([value + '.' + subValue, label2, required, type2])
          }
        }
      })
    }
  })
  // console.log('CustomersController.js fields final : ' + fields)
  return fields
}

// Get Customers meta
router.get('/meta', (req, res) => {
  Customer.customerFields().then((data) => {
    res.send(getFields(data))
    // console.log('CustomersController.js router.get /meta : ' + getFields(data))
  }).catch((err) => {
    res.send('0')
    console.log('Error : ' + err)
  })
})

// Get Customer by Id
router.get('/:id', (req, res) => {
  // if (!ObjectID.isValid(req.params.id)) { return res.status(400).send('ID Unknown : ' + req.params.id) } else {
    CustomerModel.findById(req.params.id, (err, docs) => {
      if (err) console.log('Error : ' + err)
      else res.send(docs)
    })
})

// Create a customer
router.post('/', (req, res) => {
  const newCustomer = new CustomerModel(req.body)
  newCustomer.save((err, docs) => {
    if (!err) res.send(docs)
    else console.log('Error when creating this new customer : ' + err)
  })
})

// Modify a customer
// Called from CustomerService.js with req.body
router.put('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) { return res.status(400).send('ID Unknown : ' + req.params.id) } else {
    CustomerModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true },
      (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error when updating this customer : ' + err)
      }
    )
  }
})

// Delete a customer
router.delete('/:id', (req, res) => {
  if (!ObjectID.isValid(req.params.id)) { return res.status(400).send('ID Unknown : ' + req.params.id) } else {
    CustomerModel.findByIdAndRemove(
      req.params.id,
      (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error when deleting this customer : ' + err)
      }
    )
  }
})

*/
