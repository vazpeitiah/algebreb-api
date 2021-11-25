const {Router} = require('express')
const router = Router()

const {verifyToken, isProfesor} = require('../controllers/verfify.controller')
const examController = require('../controllers/exam.controller')

router.route('/:examId').get(verifyToken, examController.getSingleApply)
router.route('/bystudent/:studentId').get(verifyToken, examController.getApplyExam)
router.route('/').post(verifyToken, isProfesor, examController.createExam)
router.route('/bygroup/:groupId').get(verifyToken, isProfesor, examController.getExamsByGroup)
router.route('/:examId').delete(verifyToken, isProfesor, examController.deleteExam)


module.exports = router