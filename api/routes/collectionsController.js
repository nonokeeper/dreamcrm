const express = require('express')
const router = express.Router()

const CollectionsModel = require('../models/Meta_Collection')

// Get Collections Metadata
router.get('/', (req, res) => {
  console.log('Get Collections')
  CollectionsModel.find((err, docs) => {
    if (err) console.log('Error : ' + err)
    else res.send(docs)
  })
})

module.exports = router
