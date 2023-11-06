const express = require('express')
const router = express.Router()
const { db } = require ('./mongoDB');

const collectionMeta = 'meta_collections';

// Create Collection
router.post('/:name', async (req,res) => {
    console.log('createCollection');
    const result = await db.createCollection(req.params.name)
    if (result.ok) {
        res.send(result.data)
    } else {
        res.send("AE")
    }
})

// Get Collection list
router.get('/', async (req,res) => {
    console.log('get Collection list');
    //const list = await db.listCollections({"name": "meta_collections"}).toArray();
    const list = await db.listCollections({}, {nameOnly: true}).toArray();
    console.log('get Collection list, list : ', list);
    const result = list.filter((list) => list.name !== "meta_collections");
    console.log('get Collection list, result : ', result);
    res.send(result);
})

// Search Collections
router.get('/:name', (req,res) => {
    console.log('get Collection search');
    try {
        var string = req.params.name;
        db.listCollections({"name": {$regex: ".*" + string + ".*"}}).toArray((err, collections) => {
            //console.log(collections);
            res.send(collections);
        });
    } catch(err) {
        console.log(err);
    }
})

// Get one Collection infos
router.get('/infos/:name', (req,res) => {
    console.log('get Collection infos');
    try {
        var customersMeta = db.collection(collectionMeta);
        customersMeta.find({"collectionName":req.params.name}).toArray((err, docs) => {
            //console.log('res : ', res);
            console.log('docs : ', docs);
            if(err) {
                res.status(500).json({
                  success:false,
                  message: err.message
                })
            }
            (docs[0] !== undefined)? res.send(docs[0].fields):res.send({})
        });
    } catch(err) {
        console.log(err);
    }

    try {
        
    } catch(err) {

    }
})

// Rename one field in Collection Meta
router.post('/meta/rename', (req, res) => {
    console.log('post meta rename');
    var entity = "fields."+req.body.field+".label"
    var query = {[entity]:req.body.label};
    console.log('query : ', query);
    var collection = req.body.collection
    
    db.collection(collectionMeta).updateOne({collectionName: collection}, { $set: query }, function(error, result) {
      (error)? console.log(error) : res.status(200).send(result)
    })
})

// Delete one field in Collection Meta
router.post('/meta/delete', (req, res) => {
    console.log('post meta delete');
    var entity = "fields."+req.body.field
    var query = {[entity]: ""};
    console.log('query : ', query);
    var collection = req.body.collection
    
    db.collection(collectionMeta).updateOne({collectionName: collection}, { $unset: query }, function(error, result) {
      (error)? console.log(error) : res.status(200).send(result)
    })
})

// Add one field in Collection Meta
router.post('/meta/add', (req, res) => {
    console.log('post meta add');
    var fieldName = "fields."+req.body.field
    var label = req.body.label
    var type = req.body.type
    var group = req.body.group
    var required = req.body.required
    var query = {
        [fieldName]: {
            "label": label,
            "type": type,
            "levelup": group,
            "required": required
        }
    };
    console.log('query : ', query);
    var collection = req.body.collection
    
    db.collection(collectionMeta).updateOne({collectionName: collection}, { $set: query }, function(error, result) {
      (error)? console.log(error) : res.status(200).send(result)
    })
  })

// Delete a Collection
router.delete('/:name', (req,res) => {
    console.log('deleteCollection : '+req.params.name);
    var collToDelete = db.collection(req.params.name);
    collToDelete.drop((err,result) => {
        //console.log('result : '+result);
        if (err) {
            console.log('Collection deletion error : '+err);
        }
        else {
            console.log('Collection '+ req.params.name +' has been removed successfully');
            res.send(result);
        }
    });
})

module.exports = router