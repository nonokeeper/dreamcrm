/* Version Mongoose */
const mongoose = require('mongoose')
const uri = 'mongodb+srv://mongodb_admin:e0wl8BtEQ50Uzcnu@dreamcluster.lt12i.mongodb.net/DreamDb?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log('MongoDb connected with mongoose')
    else console.log('MongoDb NOT connected, error : ' + err)
  }
)
