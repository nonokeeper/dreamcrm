const express = require('express')
const router = express.Router()
const DATABASE = 'DreamDb'
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)
const db = client.db(DATABASE)

async function run() {
    try {
      // Establish and verify connection
      await client.connect();
      await db.command({ ping: 1 });
      console.log("mongoDB.js / MongoDB Connected successfully");
    } catch(err) {
      console.log("Connection KO : ", err);
      setTimeout(() => { run(); }, 2000); // relance 2s après
    }
  }
run();

module.exports = {router, db, mongodb, client};