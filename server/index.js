const express = require('express')
const app = express()
const cors = require('cors')

const dotenv = require('dotenv')

dotenv.config()

// This will make mongoose not pluralize collection names at all, so mongoose.model('User', schema)
// will store documents in the 'User' collection.
// See with mongodb plugin instead of mongoose : mongoose.pluralize(null)

// Middleware bodyParser.json() devient express.json() depuis 2021
app.use(express.json())
app.use(cors())

const customersRoutes = require('./routes/api/customersController')
app.use('/api/customers', customersRoutes)

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
