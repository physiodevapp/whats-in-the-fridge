const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pantrySchema = new Schema({
  name: {
    type: String,
    required: "Pantry name is required",
    minLength: [10, "Pantry name must be at least 10 chars length"],
    unique: true
  },
  admins: [
    {
      ref: 'GrocerDinner',
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  users: [
    {
      user: {
        ref: 'GrocerDinner',
        type: mongoose.Schema.Types.ObjectId
      },
      isAdmin: {
        type: Boolean,
        default: true // TODO 
      }
    }
  ],
  mapLocation: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
      return ret
    }
  }
})

const Pantry = mongoose.model('Pantry', pantrySchema)
module.exports = Pantry
