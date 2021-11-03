const {Router} = require('express')
const router = Router()
const { signin, signup, verifyToken, updateProfile} = require('../controllers/auth.controller')

router.post('/signin', signin)
router.post('/signup', signup)
router.post('/verify', verifyToken)
router.post('/profile', updateProfile)

module.exports = router