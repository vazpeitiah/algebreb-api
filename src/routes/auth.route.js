const {Router} = require('express')
const router = Router()
const { signin, signup, verifyToken } = require('../controllers/auth.controller')

router.post('/signin', signin)
router.post('/signup', signup)
router.post('/verify', verifyToken)

module.exports = router