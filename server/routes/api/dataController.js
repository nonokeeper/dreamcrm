const { db, mongodb } = require('./mongoDB');
const router = require('./router')

const collectionMeta = 'meta_collections';
const DEFAULTSIZE = 20;
const { authenticateToken } = require ('@security/index');

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

// Get all the records from this entity
router.get('/data', (req, res) => {
  if (authenticateToken(req)) {
    console.log('dataController > authenticateToken : token valid');
    var size = DEFAULTSIZE; // Default size

    var entity = db.collection(req.query.entity);
    var attribute = req.query.meta;
    var operator = req.query.operator;
    var value = req.query.val;
    var pageNumber = req.query.pageNumber // Pagination
    var filter = {}; // Empty filter
    if (req.query.size > 0) size = parseInt(req.query.size) // Max number of results

    if (operator == 'equals') {
      filter = {[attribute]: value}
    };
    if (operator == 'contains') {
      var regExpression = new RegExp(value, 'i');
      filter = {[attribute]: regExpression}
    };
  
    entity.countDocuments(filter).then( (count) => {
      nb = count
      console.log('dataController > get /data > nb :', nb);
      if (pageNumber >= 1 && nb > size) { // Page number correct and #rows > #todisplay
        var skip = size * (pageNumber - 1)
        entity.find(filter).limit(size).skip(skip).toArray(function(err, data) {
          if(err) {
            res.status(500).send('Error during Data Find : '+err)
          } else {
            result = {data, nb};
            res.send(result);
          }
        })
      } else {
        entity.find(filter).limit(size).toArray(function(err, data) {
          if(err) {
            res.status(500).send('Error during Data Find : '+err)
          } else {
            result = {data, nb};
            res.send(result);
          }
        })
      }
    })

  } else {
    console.log('dataController > authenticateToken : token invalid!');
    res.statusMessage = 'Forbidden --> bad JWT given!';
    res.sendStatus(403);
  }


});

// Create an entity record
router.post('/data/:entity', (req,res) => {
  const collection = req.params.entity;
  if (collection !== undefined) {
    db.collection(collection).insertOne(req.body, (err, result) => {
      if (err) console.log(`Error Create a ${entity} record : `+err);
      res.status(201).send(result.insertedId)
    })
  } else {
    console.log(`No entity given!`);
  }
})

// Modify a record
router.put('/data/:entity', (req,res) => {
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
  const collection = req.params.entity;
  const document = req.params.id;
  console.log(`Delete of this id ${document} in the entity ${collection} de l'id : `);

  db.collection(collection).deleteOne({_id: new mongodb.ObjectId(document)}, (error, result) => {
    (error)? console.log(error) : console.log('Successfully deleted :' + JSON.stringify(result))
    res.status(200).send('Record deleted')
  })
})

module.exports = router