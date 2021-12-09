const { Router } = require('express')
const router = Router()
const { signin, signup, verifyToken, updateProfile } = require('../controllers/auth.controller')

router.post('/signin', signin)
router.post('/signup', signup)
router.post('/verify', verifyToken)    // Verificar si un token es valido o aun no ha expirado
router.post('/profile', updateProfile) // Actualizar perfil del usuario

module.exports = router