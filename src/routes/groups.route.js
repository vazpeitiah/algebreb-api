const express = require('express')
const router = express.Router()
const groupController = require('../controllers/groups.controller')
const {verifyToken} = require('../controllers/verfify.controller')

router.get('/:userId', verifyToken, groupController.getGroupsByUserId)

module.exports = router