const DATABASE = 'DreamDb'
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)
var db = undefined

async function run() {
    try {
      // Establish and verify connection
      await client.connect();
      db = client.db(DATABASE);
      //await db.createCollection(collection);
      await db.command({ ping: 1 });
      console.log("mongoDB.js > MongoDB Connected successfully");
    } catch(err) {
      console.log("Connection KO : ", err);
      setTimeout(() => { run(); }, 2000); // relance 2s après
    }
  }
run();

module.exports = {db, mongodb, client};