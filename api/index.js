require('./models/database')

const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')

// This will make mongoose not pluralize collection names at all, so mongoose.model('User', schema)
// will store documents in the 'User' collection.
mongoose.pluralize(null)

// Middleware bodyParser.json() devient express.json() depuis 2021
app.use(express.json())
app.use(cors())

const customersRoutes = require('./routes/customersController')
const collectionsRoutes = require('./routes/collectionsController')

app.use('/customers', customersRoutes)
app.use('/collections', collectionsRoutes)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server listening on port ${port}`))
