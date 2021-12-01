const {Router} = require('express')
const router = Router()

const groupsController = require('../controllers/groups.controller')
const {verifyToken, isProfesor} = require('../controllers/verfify.controller')

router.get('/byuser/:userId', verifyToken, isProfesor, groupsController.getGroupsByUserId)
router.get('/bystudent/:studentId', verifyToken, groupsController.getGroupsByStudent)
router.get('/:groupId', verifyToken, isProfesor, groupsController.getGroupById)
router.post('/', verifyToken, isProfesor, groupsController.createGroup)
router.post('/enroll', verifyToken, groupsController.enrollStudent)
router.put('/:groupId', verifyToken, groupsController.updateGroup)
router.delete('/:groupId', verifyToken, isProfesor, groupsController.deleteGroup)

module.exports = router