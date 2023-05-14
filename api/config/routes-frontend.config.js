const express = require('express')
const router = express.Router()

router.get('/login', (req, res, next) => res.redirect('/'))
router.get('/pantries/new', (req, res, next) => res.redirect('/'))
router.get('/pantries/:pantryId/join', (req, res, next) => res.redirect('/'))
router.get('/pantries/:pantryId/near', (req, res, next) => res.redirect('/'))
router.get('/pantries/:pantryId/products', (req, res, next) => res.redirect('/'))
router.get('/pantries/:pantryId/products/new', (req, res, next) => res.redirect('/'))
router.get('/pantries/:pantryId/invitations/new', (req, res, next) => res.redirect('/'))

module.exports = router