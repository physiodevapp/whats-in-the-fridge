const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pantrySchema = new Schema({
  name: {
    type: String,
    required: "Pantry name is required",
    minLength: [10, "Pantry name must be at least 10 chars length"]
  },
  username: {
    type: String,
    required: "Pantry username is required",
    minLength: [4, "Pantry username must be at least 4 chars len"],
    unique: true
  },
  members: [
    {
      grocerDinnerObjId: {
        ref: 'GrocerDinner',
        type: mongoose.Schema.Types.ObjectId
      },
      role: {
        type: String,
        enum: ['guest', 'vip', 'dinner', 'grocer'], // guest añade/quita productos >> vip same+ invita >> dinner same+ elimina >> grocer same+ visible por todos
        default: 'guest'
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
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
      return ret
    }
  }
})

const Pantry = mongoose.model('Pantry', pantrySchema)
module.exports = Pantry

