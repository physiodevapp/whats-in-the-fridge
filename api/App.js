// Configure environment variables
require('dotenv').config()

// Configure data base
require('./config/db.config')

// Require dependencies
const logger = require('morgan')
const createError = require('http-errors')
const mongoose = require('mongoose')
const express = require('express')

// Create express App
const app = express()

// Configure request content-type header
app.use(express.json())

// Configure HTTP request logger middleware
app.use(logger('dev'))

// Configure routes
const routes = require('./config/routes.config')
app.use('/api-fridge/v1', routes)

// Configure errors
app.use((req, res, next) => {
  next(createError(404, 'Resource not found'))
})
app.use((error, req, res, next) => {

  // Configure model validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    error = createError(400, error)
  }  
  // TODO configure duplicate ids error
  // TODO configure not found id error
  const data = {
    message: error.message
  }

  // Configure .errors property of error, if it exists
  if (error.errors) {
    const errors = Object.keys(error.errors)
      .reduce((errors, errorKey) => {
        errors[errorKey] = error.errors[errorKey]?.message || error.errors[errorKey]      
        return errors
      }, {})
    data.errors = errors
  }

  res.status(error.status).json(data)

})

// Configure port and start listening...
const port = 3001
app.listen(port, () => {
  console.log(`App is running at port ${port}`)
})