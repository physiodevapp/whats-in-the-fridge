const createError = require('http-errors')
const Like = require('../models/like.model')

module.exports.exists = (req, res, next) => {
  Like.find({ grocerDinnerObjId: req.user.id, pantryObjId: req.params.pantryId, productObjId: req.params.productId })
    .then((likes) => {
      console.log('likes >> ', likes)
      if (likes.length <= 1) {
        req.like = likes[0]
        console.log(req.like)
        next()
      } else {
        next(createError(409, "Like conflict"))
      }
    })
    .catch(next)
}

module.exports.canDinner = (action) => {
  return (req, res, next) => {
    if (req.user.role === 'dinner') {
      const canDo = req.user.id === req.like?.grocerDinnerObjId?.toString() && action === 'delete' ||
        !req.like && action === 'create'

      if (canDo) {
        next()
      } else {
        next(createError(403, "Forbidden membership activity"))
      }
    } else {
      next(createError(403, "Forbidden: you are grocer"))
    }
  }
}