const GrocerDinner = require('../models/grocerdinner.model')
const Pantry = require('../models/pantry.model')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

module.exports.create = (req, res, next) => {
  GrocerDinner.create(req.body)
    .then((grocerdinner) => {
      return Pantry.create({
        name: `${grocerdinner.username}'s tasty pantry`,
        username: `${grocerdinner.username}'s tasty pantry`,
        members: [{
          grocerDinnerObjId: grocerdinner.id,
          role: `${grocerdinner.role}`
        }],
        location : {
          "type": "Point",
          "coordinates": [
            79.814636,
            28.625181
          ]
        }
      }).then((pantry) => {
        // console.log('new grocerdinner created >> ', grocerdinner)
        Object.assign(grocerdinner, { pantries: pantry })
        res.status(201).json(grocerdinner)
      })
    })
    .catch(next)
}

module.exports.detail = (req, res, next) => {
  console.log('grocerdinner details >> ', req.grocerDinner)
  res.status(200).json(req.grocerDinner)
}

module.exports.update = (req, res, next) => {
  Object.assign(req.user, req.body)
  req.user.save()
    .then((grocerDinner) => {
      console.log('grocerDinner updated >> ', grocerDinner)
      res.status(200).json(grocerDinner)
    })
    .catch(next)
}

module.exports.delete = (req, res, next) => { //TODO rehacer
  console.log('delete >> ', req.user)
  Pantry.deleteMany({ 'members.grocerDinnerObjId': { $in: [req.user.id] }, 'members.role': { $in: [req.user.role] } })
    .then(() => {
      return GrocerDinner.deleteOne({ _id: req.params.grocerDinnerId })
        .then(() => res.status(204).json())
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
  GrocerDinner.findOne({ username: req.body.username })
    .then((grocerDinner) => {
      if (!grocerDinner) {
        next(createError(401, "Invalid credentials"))
      } else {
        return grocerDinner.checkPassword(req.body.password)
          .then((isCorrect) => {
            if (!isCorrect) {
              next(createError(401, "Invalid credentials"))
            } else {
              const token = jwt.sign(
                { sub: grocerDinner.id, exp: Date.now() / 1000 + 3_600 },
                process.env.JWT_SECRET
              )

              res.json({ token, ...grocerDinner.toJSON() })
            }
          })
      }
    })
    .catch(next)
}
