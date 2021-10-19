const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controller')
const {verifyToken, isAdmin} = require('../controllers/verfify.controller')

router.get('/', verifyToken, isAdmin, userController.getUsers)
router.post('/', verifyToken, isAdmin, userController.createUser)
router.get('/:userID', verifyToken, isAdmin, userController.getUser)
router.put('/:userID', verifyToken, isAdmin, userController.updateUser)
router.delete('/:userID', verifyToken, isAdmin, userController.deleteUser)

module.exports = router