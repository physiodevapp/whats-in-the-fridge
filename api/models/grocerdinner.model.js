const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const { isValidEmail } = require('../utils/validations.utils')

const grocerDinnerSchema = new Schema({
  name: {
    type: String,
    required: "Name is required",
    minLength: [5, "Name must be 5 chars length at least"]
  },
  email: {
    type: String,
    required: "email is required",
    validate: {
      validator: isValidEmail,
      message: "Please, enter valid email"
    },
    unique: true
  },
  password: {
    type: String,
    required: "Password is required",
    minLength: [10, "Password must be 10 chars length at least"]
  },
  confirmed: {
    type: Boolean,
    default: process.env.USER_EMAIL_CONFIRMATION_REQUIRED === "false"
  },
  username: {
    type: String,
    required: "Username is required",
    match: [/^[a-z0-9]+$/, "username must be lowercase and without spaces"],
    lowecase: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['dinner', 'grocer'],
    default: 'dinner'
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
      delete ret.password
      return ret
    }
  }
})

grocerDinnerSchema.virtual('pantries', {
  ref: "Pantry",
  localField: '_id',
  foreignField : 'members.grocerDinnerObjId'
})

grocerDinnerSchema.pre('save', function (next) {
  const grocerDinner = this
  // console.log('is password modified? >> ', grocerDinner.isModified('password'))
  if (grocerDinner.isModified('password')) {
    bcrypt.genSalt(10)
      .then((salt) => {
        return bcrypt.hash(grocerDinner.password, salt)
          .then((hash) => {
            grocerDinner.password = hash
            next()
          })
      })
      .catch(next)
  } else {
    next()
  }
})

grocerDinnerSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

const GrocerDinner = mongoose.model('GrocerDinner', grocerDinnerSchema)
module.exports = GrocerDinner