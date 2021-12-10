const {Router} = require('express')
const router = Router()

const gpsCtrl = require('../controllers/groups.controller')
const {verifyToken, isProfesor} = require('../controllers/verfify.controller')

router.get('/bystudent/:userId', verifyToken, gpsCtrl.getGroupsByStudent)
router.get('/byteacher/:userId', verifyToken, isProfesor, gpsCtrl.getGroupsByTeacher)
router.get('/:groupId', verifyToken, isProfesor, gpsCtrl.getGroupById)
router.post('/', verifyToken, isProfesor, gpsCtrl.createGroup)
router.put('/:groupId', verifyToken, gpsCtrl.updateGroup)
router.delete('/:groupId', verifyToken, isProfesor, gpsCtrl.deleteGroup)
router.post('/enroll', verifyToken, gpsCtrl.enrollStudent)  //Inscribir estudiante en un grupo

module.exports = router