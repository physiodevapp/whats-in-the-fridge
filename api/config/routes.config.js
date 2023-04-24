const express = require('express')
const router = express.Router()

const secureMid = require('../middlewares/secure.middleware')

const grocerdinnerCtrl = require('../controllers/grocerdinner.controller')
const grocerdinnerMid = require('../middlewares/grocerdinner.middleware')

const pantryCtrl = require('../controllers/pantry.controller')
const pantryMid = require('../middlewares/pantry.middleware')

const productCtrl = require('../controllers/product.controller')
const productMid = require('../middlewares/product.middleware')

const likeCtrl = require('../controllers/like.controller')
const likeMid = require('../middlewares/like.middleware')

// Testing routes
// **************
router.get('/test/:grocerDinnerId', grocerdinnerMid.exists)

// GrocerDinner routes
// *******************
router.post('/grocerdinners', grocerdinnerCtrl.create)

router.get('/grocerdinners/:grocerDinnerId', secureMid.auth, grocerdinnerMid.exists, grocerdinnerMid.isMe, grocerdinnerCtrl.detail)

router.patch('/grocerdinners/:grocerDinnerId', secureMid.auth, grocerdinnerMid.exists, grocerdinnerMid.isMe, grocerdinnerCtrl.update)

router.delete('/grocerdinners/:grocerDinnerId', secureMid.auth, grocerdinnerMid.exists, grocerdinnerMid.isMe, grocerdinnerCtrl.delete)

// Grocer pantry routes - PUBLIC
// *****************************
router.get('/pantries', pantryCtrl.list('grocer'))

// Pantry routes
// *************
router.get('/pantries/:pantryId/near', secureMid.auth, pantryMid.exists, pantryMid.canMember('near'), pantryCtrl.list('near'))

router.post('/pantries', secureMid.auth, pantryCtrl.create)

router.get('/pantries/my-pantries', secureMid.auth, pantryCtrl.list())

router.get('/pantries/:pantryId', secureMid.auth, pantryMid.exists, pantryMid.canMember(), pantryCtrl.detail)

router.patch('/pantries/:pantryId', secureMid.auth, pantryMid.exists, pantryMid.canMember('update'), pantryCtrl.update)

router.delete('/pantries/:pantryId', secureMid.auth, pantryMid.exists, pantryMid.canMember('delete'), pantryMid.count, pantryCtrl.delete)


// Product routes
//***************
router.post('/pantries/:pantryId/products', secureMid.auth, pantryMid.exists, pantryMid.canMember(), productCtrl.create)

router.get('/pantries/:pantryId/products', secureMid.auth, pantryMid.exists, pantryMid.canMember(), productCtrl.list)

router.get('/pantries/:pantryId/products/:productId', secureMid.auth, pantryMid.exists, pantryMid.canMember(), productMid.exists, productCtrl.detail)

router.patch('/pantries/:pantryId/products/:productId', secureMid.auth, pantryMid.exists, pantryMid.canMember(), productMid.exists, productCtrl.update)

router.delete('/pantries/:pantryId/products/:productId', secureMid.auth, pantryMid.exists, pantryMid.canMember(), productMid.exists, productCtrl.delete)

// Like routes
// ****************
router.post('/pantries/:pantryId/products/:productId/likes', secureMid.auth, pantryMid.exists, productMid.exists, likeMid.exists, likeMid.canDinner('create'), likeCtrl.create)

router.delete('/pantries/:pantryId/products/:productId/likes', secureMid.auth, pantryMid.exists, productMid.exists, likeMid.exists, likeMid.canDinner('delete'), likeCtrl.delete)

// Access routes
// *************
router.post('/login', grocerdinnerCtrl.login)

module.exports = router