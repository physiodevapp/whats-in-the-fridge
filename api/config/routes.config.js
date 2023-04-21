const express = require('express')
const router = express.Router()
const secureMid = require('../middlewares/secure.middleware')
const grocerdinnerCtrl = require('../controllers/grocerdinner.controller')
const grocerdinnerMid = require('../middlewares/grocerdinner.middleware')
const pantryCtrl = require('../controllers/pantry.controller')
const pantryMid = require('../middlewares/pantry.middleware')

// GrocerDinner routes
router.post('/grocerdinners', grocerdinnerCtrl.create)
router.get('/grocerdinners/:grocerdinnerId', secureMid.auth, grocerdinnerMid.exists, grocerdinnerCtrl.detail)
router.patch('/grocerdinners/:grocerdinnerId', secureMid.auth, grocerdinnerMid.exists, grocerdinnerMid.itsMe, grocerdinnerCtrl.update)
router.delete('/grocerdinners/:grocerdinnerId', secureMid.auth, grocerdinnerMid.exists, grocerdinnerMid.itsMe, grocerdinnerCtrl.delete)

// Pantry routes
router.post('/pantries', secureMid.auth, pantryCtrl.create)
router.get('/pantries', secureMid.auth, pantryCtrl.list)
router.get('/pantries/:pantryId', secureMid.auth, pantryMid.exists, pantryMid.isMember, pantryCtrl.detail)
router.patch('/pantries/:pantryId', secureMid.auth, pantryMid.exists, pantryMid.isMember, pantryCtrl.update)
router.delete('/pantries/:pantryId', secureMid.auth, pantryMid.exists, pantryMid.isMember, pantryCtrl.delete)

// TODO Product routes
router.post('/pantries/:pantryId/products', secureMid.auth, productCtrl.create)
router.get('/pantries/:pantryId/products', secureMid.auth, pantryMid.exists, pantryMid.isMember, productCtrl.list)
router.get('/pantries/:pantryId/products/:productId', secureMid.auth, pantryMid.exists, pantryMid.isMember, productMid.exists, productCtrl.detail)
router.patch('/pantries/:pantriyId/products/:productId', secureMid.auth, pantryMid.exists, pantryMid.isMember, productMid.exists, productCtrl.update)
router.patch('/pantries/:pantryId/products/:productId', secureMid.auth, pantryMid.exists, pantryMid.isMember, productMid.exists, productCtrl.delete)


// TODO Like routes

// Access routes
router.post('/login', grocerdinnerCtrl.login)

module.exports = router