const createError = require('http-errors')
const Pantry = require('../models/pantry.model')

module.exports.exists = (req, res, next) => {
  Pantry.findById(req.params.pantryId)
    .then((pantry) => {
      if (pantry) {
        req.pantry = pantry
        next()
      } else {
        next(createError(404, "Pantry not found"))
      }
    })
    .catch(next)
}

module.exports.isMember = (req, res, next) => {
  const member = req.pantry.members.filter(({grocerDinnerObjId}) => grocerDinnerObjId === req.user.id)
  if (member) {
    next()
  } else {
    next(createError(403, "Forbidden access"))
  }
}