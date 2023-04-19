const express = require('express')
const router = express.Router()
const grocerdinnnerCtrl = require('../controllers/grocerdinner.controller')

// GrocerDinner routes
router.post('/grocerdinners', grocerdinnnerCtrl.create)
router.get('/grocerdinners/:grocerdinnerId', grocerdinnnerCtrl.detail)
router.patch('/grocerdinners/:grocerdinnerId', grocerdinnnerCtrl.update)
router.delete('/grocerdinners/:grocerdinnerId', grocerdinnnerCtrl.delete)

module.exports = router