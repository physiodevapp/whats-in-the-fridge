const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { isValidUrl } = require('../utils/validations.utils')

const productSchema = new Schema({
  name: {
    type: String
  },
  barcode: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: 'Date of expiry is required'
  },
  urlImage: {
    type: String,
    validate: {
      validator: isValidUrl
    }
  },
  author: {
    ref: 'GrocerDinner',
    type: mongoose.Schema.Types.ObjectId
  },
  tags: [
    {
      type: String,
      minLenght: [4, "Tag must be at least 4 chars length"]
    }
  ]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
      return ret
    }
  }
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product