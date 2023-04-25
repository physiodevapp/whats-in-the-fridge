const Pantry = require('../models/pantry.model')
const Product = require('../models/product.model')
const createError = require('http-errors')

module.exports.create = (req, res, next) => {
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
      console.log(req.pantry)
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
  console.log('update')
  if (req.userInvitation) {
    console.log(req.pantry.members)
    req.pantry.members.push(req.userInvitation.newMember)
  } else {
    Object.assign(req.pantry, req.body)
  }
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