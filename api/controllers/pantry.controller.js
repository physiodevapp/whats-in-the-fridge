const Pantry = require('../models/pantry.model')
const Product = require('../models/product.model')
const Invitation = require('../models/invitation.model')
const createError = require('http-errors')
const sendInvitationEmail = require('../config/mailer.config')
const randomize = require('randomatic')
const { auth } = require('../middlewares/secure.middleware')
const { default: mongoose } = require('mongoose')

module.exports.create = (req, res, next) => {
  console.log('create pantry >> ')
  req.body.members = [
    {
      grocerDinnerObjId: req.user.id,
      role: req.user.role
    }
  ]
  Pantry.create(req.body)
    .then((pantry) => {
      res.status(201).json(pantry)
    })
    .catch(next)
}

module.exports.list = (focus) => {
  return (req, res, next) => {
    if (focus === 'near') {
      console.log('near ', req.pantry)
      const params = {
        longitude: req.pantry.location.coordinates[0],
        latitude: req.pantry.location.coordinates[1],
        distance: parseFloat(req.query?.distance),
        unit: req.query?.unit || 'km'
      }
      // console.log('params >> ', params)

      Pantry.findByDistance(params)
        .then((pantries) => {
          if (pantries) {
            res.status(200).json(pantries)
          } else {
            next(createError(404, "No pantries found"))
          }
        })
        .catch(next)

    } else {
      const criterial = focus === 'grocer' ? { 'members.role': { $in: [focus] } } : { 'members.grocerDinnerObjId': { $in: [req.user.id] } }
      Pantry
        .find(criterial)
        .populate('members.grocerDinnerObjId')
        .then((pantries) => {
          if (pantries.length) {
            res.status(200).json(pantries)
          } else {
            next(createError(404, "No pantries found"))
          }
        })
        .catch(next)
    }
  }
}

module.exports.detail = (req, res, next) => {
  res.status(200).json(req.pantry)
}

module.exports.update = (req, res, next) => {
  // console.log('update')
  Object.assign(req.pantry, req.body)
  req.pantry.save()
    .then((pantry) => {
      console.log('pantry updated >> ', pantry)
      res.status(200).json(pantry)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Product.deleteMany({ grocerDinnerObjId: req.user.id, pantryObjId: req.params.pantryId })
    .then(() => {
      return Pantry.deleteOne({ _id: req.params.pantryId })
        .then(() => res.status(204).json())
        .catch(next)
    })
    .catch(next)
}

module.exports.invite = (req, res, next) => {

  const token = randomize('A', 8)
  req.body.token = token
  req.body.pantryObjId = req.pantry.id

  // console.log('create invitation req.body', req.body)

  Invitation.create(req.body)
    .then((invitation) => {
      console.log('send invitation ', invitation)
      // SEND INVITATION EMAIL
      sendInvitationEmail(invitation)

    })
    .catch(next)

}

module.exports.join = (req, res, next) => {
  // console.log('join pantry ', req.body)

  // req.pantry.members.push
  const newGuest = {
    grocerDinnerObjId: new mongoose.Types.ObjectId(req.user.id),
    role: 'guest',
    defaultOwner: false
  }
  // console.log('newGuest is ', newGuest)
  // console.log('req.pantry.id ', req.pantry.id)
  Pantry.updateOne({ _id: new mongoose.Types.ObjectId(req.pantry.id) }, { $addToSet: { members: newGuest } })
    .then((response) => {
      // console.log('new guest joined ', response)
      if (response.modifiedCount === 1) {
        return Invitation.deleteOne({ _id: new mongoose.Types.ObjectId(req.invitation.id) })
          .then(() => res.status(200).json({}))
      } else {
        next(createError(400, "Join proccess wasn't completed. Invitation still pending"))
      }

      // TODO REMOVE INVITATION
    })
    .catch(next)
}