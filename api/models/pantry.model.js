const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pantrySchema = new Schema({
  name: {
    type: String,
    required: "Pantry name is required",
    minLength: [10, "Pantry name must be at least 10 chars length"]
  },
  // username: {
  //   type: String,
  //   required: "Pantry username is required",
  //   minLength: [4, "Pantry username must be at least 4 chars len"],
  //   unique: true
  // },
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
      },
      defaultOwner: {
        type: Boolean,
        default: false,
        required: true
      }
    }
  ],
  address: String,
  location: {
    type: new Schema({
      type: {
        type: String,
        enum: ['Point'],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }),
    validate: {
      validator: function(location) {
        console.log('location validation >> ', location)
        return this.address != undefined && location.coordinates?.length
      },
      message: `Location is required`
    }
  }
}, {
  timestamps: true,
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret.__v
      ret.id = ret._id
      delete ret._id
      ret.location = {
        address: ret.address,
        coordinates: ret.location.coordinates
      }
      delete ret.address
      return ret
    }
  }
})

pantrySchema.index({ location: "2dsphere" })

pantrySchema.static('findByDistance', function ({ longitude, latitude, distance, unit }) {

  const unitValue = unit === "km" ? 1000 : 1609.3 // miles >> unit: 'm'
  return this.aggregate(
    [{
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        query: {
          'members.role': 'grocer'
        },
        maxDistance: distance * unitValue,
        distanceField: 'distance',
        distanceMultiplier: 1 / unitValue,
        key: 'location',
        spherical: true
      },
    },
    {
      $sort: {
        distance: 1
      }
    }
      // {
      //   $limit: 4 
      // }
    ]
  )
})

const Pantry = mongoose.model('Pantry', pantrySchema)
module.exports = Pantry

