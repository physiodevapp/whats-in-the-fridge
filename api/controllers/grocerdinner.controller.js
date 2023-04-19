const GrocerDinner = require('../models/grocerdinner.model')

module.exports.create = (req, res, next) => {
  console.log('create')
  GrocerDinner.create(req.body)
  .then((grocerdinner) => {
    console.log('new grocerdinner created >> ', grocerdinner)
    res.status(201).json(grocerdinner)
  })
  .catch(next)
}

module.exports.detail = (req, res, next) => {
  console.log('detail')
  res.json(req.params)
}

module.exports.update = (req, res, next) => {
  console.log('update')
  res.json()
}

module.exports.delete = (req, res, next) => {
  console.log('delete')
  res.json()
}