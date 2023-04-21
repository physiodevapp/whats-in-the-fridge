const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const GrocerDinner = require('../models/grocerdinner.model')

module.exports.cleanBody = (req, res, next) => {
  delete req._id
  delete req.password
  delete req.__v
  delete req.createdAt
  delete req.updatedAt
  next()
}

module.exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")?.[1]
  if (!token) {
    next(createError(401, "Missing token"))
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('decoded >> ', decoded)
    GrocerDinner.findById(decoded.sub)
      .then((grocerDinner) => {
        if (grocerDinner) {
          req.user = grocerDinner
          console.log('user >> ', req.user)
          next()
        } else {
          next(createError(404, "GrocerDinner not found"))
        }
      })
      .catch(next)
  } catch (error) {
    next(createError(401, error))
  }
}