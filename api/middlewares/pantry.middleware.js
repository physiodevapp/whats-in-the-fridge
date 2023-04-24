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

module.exports.canMember = (action) => {
  return (req, res, next) => {
    const member = req.pantry.members.find((member) => member.grocerDinnerObjId == req.user.id)
    if (member) {      
      const canDo = member.role === req.user.role && (action === 'delete' || action === 'near')   ||
      req.user.role !== 'guest' && action === 'update' ||
      !action

      if (canDo) {
        next()
      } else {
        next(createError(403, "Forbidden membership activity"))
      }

    } else {
      next(createError(403, "Forbidden membership"))
    }
  }
}

module.exports.count = (req, res, next) => {
  Pantry.find({ 'members.grocerDinnerObjId': { $in: [req.user.id] } })
    .then((pantries) => {
      if (pantries.length > 1) {
        next()
      } else {
        next(createError(404, "Forbidden deletion: you can not have no pantries"))
      }
    })
    .catch(next)
} 