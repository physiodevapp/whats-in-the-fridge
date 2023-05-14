const Product = require('../models/product.model')
const createError = require('http-errors')

module.exports.exists = (existMode) => {
  return (req, res, next) => {
    Product.find(
      {
        $or: [
          { _id: req.params?.productId },
          {
            $and: [
              { barcode: req.body?.barcode },
              { pantryObjId: req.pantry?._id }
            ]
          }]
      })
      .then((products) => {
        if ((products?.length && existMode === 'required') ||
          (!products?.length && existMode === 'not-required')) {
          req.product = products[0] || null
          console.log('product exists >> ', req.product)
          next()
        } else if (existMode === 'not') {
          next(createError(409, "Product already exists in the pantry"))
        } else {
          next(createError(404, "Product not found"))
        }
      })
      .catch(next)
  }
} 