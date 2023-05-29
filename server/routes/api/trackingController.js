const { client, mongodb } = require('./mongoDB');
const router = require('./router');
let collectionEmailLog = 'Log_Email';
const DATABASE = 'DreamDb'

// Get Open tracking
router.get('/tracking/:email/:jobId', async (req,res) => {
    const email = req.params['email'];
    const jobID = parseInt(req.params['jobId']);

    try {
        // Establish and verify connection
        await client.connect();
        var db = client.db(DATABASE);
        await db.command({ ping: 1 });
        console.log("trackingController.js > MongoDB Connected successfully");
        console.log('trackingController.js > Email : ', email);
        console.log('trackingController.js > Job ID : ', jobID);
        console.log('trackingController.js > collectionEmailLog : ', collectionEmailLog);

        //const id = await db.collection(collectionEmailLog).findOne({ $and: [ { jobID: jobID }, { email: email }, { openStatus: false} ] });
        //console.log('trackingController.js > id found : ', id);
        //if (id) {
            const result = await db.collection(collectionEmailLog).updateOne(
                { jobID: jobID , email: email },
                {
                    $set: { openStatus: true}
                }
            );
            console.log('trackingController.js > update Result : ', result);
        //}
        res.status(200).send("Open tracking done");
    } catch(err) {
        res.status(500).send("Tracking error : "+err);
    }
});

module.exports = router