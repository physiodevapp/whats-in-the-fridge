const Pantry = require('../models/pantry.model')
const createError = require('http-errors')

module.exports.create = (req, res, next) => {
  Pantry.create(req.body)
    .then((pantry) => {
      res.status(201).json(pantry)
    })
    .catch(next)
}

module.exports.list = (req, res, next) => {
  Pantry.find({ 'members.grocerDinnerObjId': { $in: [req.user.id] } })
    .then((pantries) => {
      if (pantries) {
        res.status(200).json(pantries)
      } else {
        next(createError(404, "No pantries found"))
      }
    })
    .catch(next)
}

module.exports.detail = (req, res, next) => {
  res.status(200).json(req.pantry)
}

module.exports.update = (req, res, next) => {
  Object.assign(req.pantry, req.body)
  req.pantry.save()
    .then((pantry) => {
      console.log('pantry updated >> ', pantry)
      res.status(200).json(pantry)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => {
  Pantry.deleteOne({ _id: req.params.pantryId })
    .then(() => res.json(204).json())
    .catch(next)
}