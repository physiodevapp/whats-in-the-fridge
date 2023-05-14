// Configure environment variables
require('dotenv').config()

// Configure data base
require('./config/db.config')

// Require dependencies
const logger = require('morgan')
const createError = require('http-errors')
const mongoose = require('mongoose')
const express = require('express')
const secureMid = require('./middlewares/secure.middleware')

// Create express App
const app = express()


// Configure CORS
const cors = require('./config/cors.config')
app.use(cors)

// Configure public resources
app.use(express.static(`${__dirname}/public/frontend/build`)) 

// Configure request unwanted data
app.use(secureMid.cleanBody)

// Configure request content-type header
app.use(express.json())

// Configure HTTP request logger middleware
app.use(logger('dev'))

// Configure routes
const routes = require('./config/routes.config')
app.use('/api-fridge/v1', routes)

const routesFrontend = require('./config/routes-frontend.config')
app.use('/', routesFrontend)

// Configure errors
app.use((req, res, next) => {
  console.log('errors params, ')
  // res.redirect('/')
  next(createError(404, 'Resource not found'))
})
app.use((error, req, res, next) => {

  if (error instanceof mongoose.Error.ValidationError) {
    // Configure model validation errors
    error = createError(400, error)
  } else if (error instanceof mongoose.Error.CastError
    && error.path === '_id') {
    // Configure not found id error
    const resourceName = error.model().constructor.modelName
    error = createError(404, `${resourceName} not found`)
  } else if (error.message.includes('E11000')) {
    // Configure duplicate keys error
    Object.keys(error.keyValue).forEach((key) => error.keyValue[key] = "Already exists")
    // OPCION 1 >> devuelve el mensaje de error original, que incluye el valor de la key duplicada
    // Object.assign(error, { errors: error.keyValue })
    // error = createError(409, error)

    // OPCION 2 >> le pasamos como segundo argumento a createError el objeto de errores y, como por defecto un error siempre tiene mensaje, en este caso el mensaje lo cogerá directamente del tipo de error, en este caso, 409. 
    // NOTA: aunque el segundo argumento de createError fuera undefined, seguiría existiendo un campo message con el texto correspondiente al código de error del primer argumento!
    error = createError(409, { errors: error.keyValue })
  } else if (!error.status) {
    error = createError(500, error)
  }
  // console.log(error)
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
const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`App is running at port ${port}`)
})