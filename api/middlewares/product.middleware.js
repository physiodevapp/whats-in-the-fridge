const Product = require('../models/product.model')
const createError = require('http-errors')

module.exports.exists = (req, res, next) => {
  Product.findById(req.params.productId)
    .then((product) => {
      if (product) {
        req.product = product
        next()
      } else {
        next(createError(404, "Product not found"))
      }
    })
    .catch(next)
}