const { router, db, mongodb } = require('./mongoDB');

//const collection = 'Customers';
const collectionMeta = 'meta_collections';
const DEFAULTSIZE = 25;

// import { authenticateToken } from '../../security/index.ts';
console.log('dataController called');

// Get Metadata
router.get('/data/meta', (req,res) => {
  //console.log('dataController.js meta > req.query.entity : ', req.query.entity)
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

// Get all the records from this entity
router.get('/data', (req, res) => {
  //console.log('dataController.js > req.query', req.query)
  var data = db.collection(req.query.entity);
  //console.log('dataController.js > data : ', data)
  
  data.countDocuments().then( (count) => {
    let nb = count
    //console.log('dataController.js > nb :', nb);
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

// Create an entity record
router.post('/data/:entity', (req,res) => {
  console.log('params.entity = ', req.params.entity);
  if (req.params.entity !== undefined) {
    db.collection(req.params.entity).insertOne(req.body, (err, result) => {
      if (err) console.log(`Error Create a ${entity} record : `+err);
      res.status(201).send(result.insertedId)
    })
  } else {
    console.log(`No entity given!`);
  }
})

// Modify a record
router.put('/data/:entity', function(req,res){
  const collection = req.params.entity;
  const document = req.body._id;
  console.log(`Update of this id ${document} in the entity : ${collection}`);
  delete(req.body._id)
  db.collection(collection).updateOne({_id: new mongodb.ObjectId(document)}, { $set: req.body }, function(err, result) {
    if(err) {
      res.status(500).send(`Error during the update of this record ${id} in the entity : ${entity}`)
    } else {
      res.status(200).send(result)
    }
  })
})

// Delete an entity record
router.delete('/data/:entity/:id', (req, res) => {
  // TODO
  const collection = req.params.entity;
  const document = req.params.id;
  console.log(`Delete of this id ${document} in the entity ${collection} de l'id : `);

  db.collection(collection).deleteOne({_id: new mongodb.ObjectId(document)}, (error, result) => {
    (error)? console.log(error) : console.log('Successfully deleted :' + JSON.stringify(result))
    res.status(200).send('Record deleted')
  })
})

module.exports = router