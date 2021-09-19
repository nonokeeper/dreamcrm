const express = require('express')
const router = express.Router()
const ObjectID = require('mongoose').Types.ObjectId

const Customer = require('../models/Customer')
// Get Customer model from Collection metadata

// set defaultModel to variable customerModel
var CustomerModel = Customer.defaultModel

Customer.customerModel().then((data) => {
  CustomerModel = data // set good CustomerModel to variable customerModel
}).catch((err) => { console.log('Error : ' + err) })

// Get Customers
router.get('/', (req, res) => {
  CustomerModel.find((err, docs) => {
    if (err) console.log('Error : ' + err)
    else {
      res.send(docs)
    }
  })
})

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
  if (!ObjectID.isValid(req.params.id)) { return res.status(400).send('ID Unknown : ' + req.params.id) } else {
    CustomerModel.findById(req.params.id, (err, docs) => {
      if (err) console.log('Error : ' + err)
      else res.send(docs)
    })
  }
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

module.exports = router
