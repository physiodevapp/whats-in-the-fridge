const GrocerDinner = require('../models/grocerdinner.model')
const createError = require('http-errors')

module.exports.exists = (req, res, next) => {
  GrocerDinner.findById(req.params.grocerdinnerId)
  .then((grocerdinner) => {
    if (grocerdinner) {
      req.grocerdinner = grocerdinner
      next()
    } else {
      next(createError(404, "Grocerdinner not found"))
    }
  })
  .catch(next)
}

module.exports.itsMe = (req, res, next) => {
  if (req.user.id !== req.params.grocerdinnerId) {
    next(createError(403, "Forbidden"))
  } else {
    next()
  }
}