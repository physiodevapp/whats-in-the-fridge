const Product = require('../models/product.model')
const createError = require('http-errors')

module.exports.create = (req, res, next) => {
  Object.assign(req.body, { grocerDinnerObjId: req.user.id, pantryObjId: req.pantry.id })
  Product.create(req.body)
    .then((product) => {
      res.status(200).json(product)
    })
    .catch(next)
}

module.exports.list = (req, res, next) => {
  const criterial = {
    grocerDinnerObjId: req.user.id,
    pantryObjId: req.pantry.id
  }
  Product.find(criterial)
    .then((products) => {
      if (products.length) {
        res.status(200).json(products)
      } else {
        next(createError(404, "No products found"))
      }
    })
    .catch(next)
}

module.exports.detail = (req, res, next) => {
  res.status(200).json(req.product)
}

module.exports.update = (req, res, next) => {
  Object.assign(req.product, { grocerDinnerObjId: req.user.id, pantryObjId: req.pantry.id, ...req.body })
  req.product.save()
    .then((product) => {
      res.status(200).json(product)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Product.deleteOne({_id: req.params.productId})
  .then(() => res.status(204).json())
  .catch(next)
}