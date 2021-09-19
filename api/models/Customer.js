const mongoose = require('mongoose')
const CollectionsModel = require('../models/Meta_Collection')

module.exports = {
  customerModel: async function customerModel () {
    const res = await CollectionsModel.findOne({ collectionName: 'Customers' })
    // console.log('Customer.js fields' + res.fields[0])
    return mongoose.model('Customers', mongoose.Schema(res.fields, { timestamps: {} }))
  },
  customerFields: async function customerFields () {
    const res = await CollectionsModel.findOne({ collectionName: 'Customers' }, { fields: 1, _id: 0 })
    // console.log('Customer.js res' + res)
    return res
  },
  defaultModel: mongoose.model('default', mongoose.Schema({}))
}
