const { db } = require('./mongoDB');
const router = require('./router');

// Get Open tracking
router.get('/tracking/:email/:jobId', (req,res) => {
    console.log('trackingController.js > Email : ', req.params['email']);
    console.log('trackingController.js > Job ID : ', req.params['jobId']);
    res.status(200).send("Tracking super done");
});

module.exports = router