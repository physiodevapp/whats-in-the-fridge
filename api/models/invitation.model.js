const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { isValidEmail } = require('../utils/validations.utils')

const invitationSchema = new Schema({
  grocerDinnerObjId: {
    ref: "GrocerDinner",
    type: mongoose.Schema.Types.ObjectId
  },
  token: {
    type: String,
    minLength: [8, "Code must be 8 chars length at least"]
  },
  guestEmail: {
    type: String,
    required: "email is required",
    validate: {
      validator: isValidEmail,
      message: "Please, enter valid email"
    }
  },
  pantryObjId: {
    ref: "Pantry",
    type: mongoose.Schema.Types.ObjectId
  },
  expireAt: {
    type: Date,
    expires: 10 // 10 seconds
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

invitationSchema.index({createAt: 1}, {expireAfterSeconds: 100000})

const Invitation = mongoose.model('Invitation', invitationSchema)
module.exports = Invitation