const GrocerDinner = require('../models/grocerdinner.model')
const createError = require('http-errors')

module.exports.exists = (req, res, next) => {
  const grocerDinnerId = req.params.grocerDinnerId === 'me' ? req.user.id : req.params.grocerDinnerId

  GrocerDinner.findById(grocerDinnerId)
    .populate('pantries')
    .then(async (grocerDinner) => {
      if (grocerDinner) {
        req.grocerDinner = grocerDinner
        next()
      } else {
        next(createError(404, "Grocerdinner not found"))
      }
    })
    .catch(next)
}

module.exports.isMe = (req, res, next) => {
  // console.log('isMe ?? >> ', req.params.grocerDinnerId)
  if (req.user.id !== req.params.grocerDinnerId &&
    req.params.grocerDinnerId !== 'me') {
    next(createError(403, "Forbidden"))
  } else {
    next()
  }
}