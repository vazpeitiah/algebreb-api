const {Router} = require('express')
const router = Router()

const {verifyToken, isProfesor} = require('../controllers/verfify.controller')
const examController = require('../controllers/exam.controller')

router.route('/:examId').get(verifyToken, examController.getFormExam) // Get single exam
router.route('/data/:examId').get(verifyToken, examController.getExam) // Get single exam data
router.route('/bystudent/:studentId').get(verifyToken, examController.getFormsExam) // get exams for an student
router.route('/kardex').post(verifyToken, examController.getKardex) // get kardex of student
router.route('/').post(verifyToken, isProfesor, examController.createExam) // create new exam
router.route('/teacher/:examId').get(verifyToken, isProfesor, examController.getExams) // get exams for teacher
router.route('/:examId').put(verifyToken, isProfesor, examController.updateExam) // update exam
router.put('/data/:examId', verifyToken, isProfesor, examController.updateApplyExam)
router.route('/submit/:examId').post(verifyToken, examController.submitExam) // submit answers of an exam
router.route('/bygroup/:groupId').get(verifyToken, isProfesor, examController.getExamsByGroup) // get exams of one group
router.route('/:examId').delete(verifyToken, isProfesor, examController.deleteExam) // delete exam
router.post('/uploadIMG/:examId', verifyToken, examController.uploadImages)
router.post('/updatesheet/:examId', verifyToken, isProfesor, examController.updateSheet)
module.exports = router