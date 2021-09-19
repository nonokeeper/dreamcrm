const mongoose = require('mongoose')

const CollectionsSchema = mongoose.Schema({
  collectionName: {
    type: String
  },
  fields: {
    type: Array
  }
})

module.exports = mongoose.model('meta_collections', CollectionsSchema)
