const Like = require('../models/like.model')

module.exports.create = (req, res, next) => {
  Like.create({ grocerDinnerObjId: req.user.id, pantryObjId: req.params.pantryId, productObjId: req.params.productId })
    .then((like) => {
      res.status(201).json(like)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Like.deleteOne({ _id: req.params.likeId })
    .then(() => res.status(204).json())
    .catch(next)
}