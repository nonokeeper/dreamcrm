const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const favicon = require('serve-favicon')

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true}))

const customersRoutes = require('./routes/api/customersController')
app.use('/api/customers', customersRoutes)

const collectionsRoutes = require('./routes/api/collectionsController')
app.use('/api/collections', collectionsRoutes)

const usersRoutes = require('./routes/api/usersController')
app.use('/api/users', usersRoutes)

const loginRoutes = require('./routes/api/loginController')
app.use('/api', loginRoutes)

app.use(favicon(__dirname + '/favicon.ico'));

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
