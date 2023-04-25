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
      const canDo = member.role === req.user.role && (req.user.pantries.length > 1 && action === 'delete') ||
        member.role === req.user.role && action === 'near' ||
        member.role !== 'guest' && action === 'update' ||
        !action

      if (canDo) {
        next()
      } else if (action === 'delete') {
        next(createError(404, "Forbidden deletion: you can not have no pantries"))
      } else if (action === 'join') {
        next(createError(400, "Already member of this pantry"))
      } else {
        next(createError(403, "Forbidden membership activity"))
      }

    } else if (!member && action === 'join') {
      next()

    } else {
      next(createError(403, "Forbidden membership"))
    }
  }
}
