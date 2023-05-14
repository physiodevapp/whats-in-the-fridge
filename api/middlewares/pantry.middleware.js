const createError = require('http-errors')
const Pantry = require('../models/pantry.model')
const Invitation = require('../models/invitation.model')
const GrocerDinner = require('../models/grocerdinner.model')
const { default: mongoose } = require('mongoose')

module.exports.exists = (req, res, next) => {
  Pantry.findById(req.params.pantryId)
    .then((pantry) => {
      if (pantry) {
        req.pantry = pantry
        console.log('pantry exists >> ', req.pantry)
        next()
      } else {
        next(createError(404, "Pantry not found"))
      }
    })
    .catch(next)
}

module.exports.canMember = (action) => {
  return (req, res, next) => {

    const member = req.pantry.members.find((member) => member.grocerDinnerObjId == req.user.id)

    if (member) {
      const canDo = member.role === req.user.role && (req.user.pantries.length > 1 && action === 'delete') ||
        (member.role === req.user.role || member.role === 'vip') && action === 'near' ||
        member.role === req.user.role && action === 'invite' ||
        member.role !== 'guest' && action === 'update' ||
        !action

      if (canDo) {
        console.log('member canDo >> ', canDo)

        if (action === 'invite') {
          GrocerDinner.find({ email: req.body.guestEmail })
            .then((grocerDinner) => {
              // console.log('invite grocerDinner ', grocerDinner)
              if (grocerDinner) {
                // console.log('invite req.params.id ', req.params.pantryId)
                return Pantry.find({ id: req.params.id, 'members.grocerDinnerObjId': { $in: [grocerDinner.id] } })
                  .then((guest) => {
                    // console.log('invite guest ', guest)
                    if (!guest.length) {

                      return Invitation.find({ pantryObjId: req.params.pantryId, guestEmail: req.body?.guestEmail })
                        .then((invitation) => {
                          if (!invitation.length) {
                            next()
                          } else {
                            next(createError(404, "Member already invited"))
                          }
                        })

                    } else {
                      next(createError(404, "Member already guest"))
                    }

                  })

              } else {
                next(createError(401, "Guest is not registered yet"))
              }

            })
            .catch(next)

        } else {
          next()
        }

      } else if (action === 'delete') {
        next(createError(404, "Forbidden deletion: you can not have no pantries"))
      } else if (action === 'join') {
        next(createError(403, "Already joined"))
      } else {
        next(createError(403, "Forbidden membership activity"))
      }

    } else if (action === 'join' &&
      req.user.email === req.body.guestEmail) {
        console.log('join action ', req.body)
      Invitation.find({ token: req.body.token, guestEmail: req.body.guestEmail, pantryObjId: new mongoose.Types.ObjectId(req.params.pantryId) })
        .then((invitations) => {
          console.log('pending invitations ', invitations)
          if (invitations.length === 1) {
            req.invitation = invitations[0]
            next()
          } else {
            next(createError(403, "Forbidden join activity"))
          }
        })
        .catch(next)
    } else {
      next(createError(403, "Forbidden membership"))
    }
  }
}
