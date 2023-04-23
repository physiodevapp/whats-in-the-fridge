const mongoose = require('mongoose')
const Schema = mongoose.Schema

const likeSchema = new Schema({
  grocerDinnerObjId: {
    ref: "GrocerDinner",
    type: mongoose.Schema.Types.ObjectId
  },
  pantryObjId: {
    ref: "Pantry",
    type: mongoose.Schema.Types.ObjectId
  }, 
  productObjId: {
    ref: "Product",
    type: mongoose.Schema.Types.ObjectId
  }
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

const Like = mongoose.model('Like', likeSchema)
module.exports = Like