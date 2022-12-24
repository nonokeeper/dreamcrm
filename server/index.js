const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const favicon = require('serve-favicon')

console.log("Starting...");

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true}))

const customersRoutes = require('./routes/api/customersController')
//console.log("API Customers Routes loaded");
app.use('/api/customers', customersRoutes)
//console.log("API Customers loaded");
const collectionsRoutes = require('./routes/api/collectionsController')
app.use('/api/collections', collectionsRoutes)
//console.log("API Collections loaded");
const usersRoutes = require('./routes/api/usersController')
app.use('/api/users', usersRoutes)
//console.log("API Users loaded");
const loginRoutes = require('./routes/api/loginController')
app.use('/api', loginRoutes)
//console.log("Starting...");
//console.log("API Login loaded");
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
