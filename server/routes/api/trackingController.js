const { client } = require('./mongoDB');
const router = require('./router');
let collectionEmailLog = 'Log_Email';

// Get Open tracking
router.get('/tracking/:email/:jobId', async (req,res) => {
    const email = req.params['email'];
    const jobID = req.params['jobID'];

    try {
        // Establish and verify connection
        await client.connect();
        var db = client.db(DATABASE);
        console.log('trackingController.js > Email : ', req.params['email']);
        console.log('trackingController.js > Job ID : ', req.params['jobId']);
        console.log('trackingController.js > collectionEmailLog : ', collectionEmailLog);

        const result = await db.collection(collectionEmailLog).updateOne(
            { email: email, jobID: jobID },
            {
                $set: { openStatus: true}
            }
        );
        console.log('trackingController.js > update Result : ', result);
        res.status(200).send("Open tracking done");
    } catch(err) {
        res.status(500).send("Tracking error : "+err);
    }
});

module.exports = router