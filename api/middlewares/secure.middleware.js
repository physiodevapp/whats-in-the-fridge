const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const GrocerDinner = require('../models/grocerdinner.model')

module.exports.cleanBody = (req, res, next) => {
  delete req._id
  delete req.password
  delete req.__v
  delete req.createdAt
  delete req.updatedAt
  next()
}

module.exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")?.[1]
  if (!token) {
    next(createError(401, "Missing token"))
    // redirect to login ?? desde react
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('decoded >> ', decoded)
    GrocerDinner.findById(decoded.sub)
      .populate('pantries')
      .then((grocerDinner) => {
        if (grocerDinner) {
          req.user = grocerDinner
          console.log('user >> ', req.user)
          next()
        } else {
          next(createError(404, "GrocerDinner not found"))
        }
      })
      .catch(next)
  } catch (error) {
    next(createError(401, error))
  }
}

module.exports.invitationAuth = (req, res, next) => {
  const token = req.params.invitationToken
  console.log('invitationToken >> ', req.params)
  if (!token) {
    next(createError("Missing token"))
  }
  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    console.log('decoded invitation token >> ', decoded)
    GrocerDinner.findOne({ email: decoded.sub })
      .populate('pantries')
      .then((grocerDinner) => {
        if (grocerDinner && grocerDinner?.role === 'dinner') {
          req.user = grocerDinner 
          // como hacer para que te loguee y a continuación ya sigua con el proceso de invitarte (la segunda parte si funciona). Habria que redirigir a la pagina del login si no es persistente el token y desde ahi continuar
          req.params.pantryId = decoded.pantryId
          req.userInvitation = {
            newMember: {
              grocerDinnerObjId: grocerDinner._id,
              role: 'guest'
            }
          }
          console.log('invitation user >> ', req.user)
          next()
        } else {
          next(createError(404, "Not a dinner yet!"))
          // redirect en react al login ??
        }
      })
      .catch(next)
  } catch (error) {
    next(createError(401, error))
  }
}