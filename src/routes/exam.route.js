const {Router} = require('express')
const router = Router()

const {verifyToken, isProfesor} = require('../controllers/verfify.controller')
const ctrl = require('../controllers/exam.controller')

router.get('/:examId', verifyToken, ctrl.getFormExam)   // Get single exam
router.get('/data/:examId', verifyToken, ctrl.getExam) // Get single exam data
router.get('/bystudent/:studentId', verifyToken, ctrl.getFormsExam) // get exams for an student
router.post('/kardex', verifyToken, ctrl.getKardex) // get kardex of student
router.post('/', verifyToken, isProfesor, ctrl.createExam) // create new exam
router.get('/teacher/:examId', verifyToken, isProfesor, ctrl.getExams) // get exams for teacher
router.put('/:examId', verifyToken, isProfesor, ctrl.updateExam) // update exam
router.put('/data/:examId', verifyToken, isProfesor, ctrl.updateApplyExam)
router.post('/submit/:examId', verifyToken, ctrl.submitExam) // submit answers of an exam
router.get('/bygroup/:groupId', verifyToken, isProfesor, ctrl.getExamsByGroup) // get exams of one group
router.delete('/:examId', verifyToken, isProfesor, ctrl.deleteExam) // delete exam
router.post('/uploadIMG/:examId', verifyToken, ctrl.uploadImages)
router.post('/updatesheet/:examId', verifyToken, isProfesor, ctrl.updateSheet)

module.exports = router