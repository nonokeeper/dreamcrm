const { db } = require('./mongoDB');
const router = require('./router');

// Get Open tracking
router.get('/tracking/:email/:jobId', (req,res) => {
    const email = req.params['email'];
    const jobID = req.params['jobID'];
    
    console.log('trackingController.js > Email : ', req.params['email']);
    console.log('trackingController.js > Job ID : ', req.params['jobId']);

    db.collection(collectionEmailLog).updateOne(
        { email: email, jobID: jobID },
        {
            $set: { openStatus: true}
        }
    );

    res.status(200).send("Tracking super done");
});

module.exports = router