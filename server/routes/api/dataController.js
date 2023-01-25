const { router, db } = require('./mongoDB');

//const collection = 'Customers';
const collectionMeta = 'meta_collections';
const DEFAULTSIZE = 25;

// import { authenticateToken } from '../../security/index.ts';
console.log('dataController called');

// Get Metadata
router.get('/data/meta', (req,res) => {
  console.log('dataController.js meta > req.query.entity : ', req.query.entity)
  db.collection(collectionMeta).find({collectionName:req.query.entity}).toArray((err, docs) => {
    if(err) {
      res.status(500).json({
        success:false,
        message: err.message
      })
    }
    if (docs[0] != undefined) {
      res.send(docs[0].fields)
    } else {
      res.status(204).json({
        success:true,
        message: "No Content"
      })
    }
  })
})

// Get Data
router.get('/data', (req, res) => {
  console.log('dataController.js > req.query', req.query)
  var data = db.collection(req.query.entity);
  //console.log('dataController.js > data : ', data)
  
  data.countDocuments().then( (count) => {
    let nb = count
    console.log('dataController.js > nb :', nb);
    data.find().toArray(function(err, data) {
      if(err) {
        res.status(500).send('dataController.js > Error during Data Find : '+err)
      } else {
        let result = {data, nb};
        res.send(result);
      }
    })
  })
});

//console.log("API CustomersController loaded");

module.exports = router