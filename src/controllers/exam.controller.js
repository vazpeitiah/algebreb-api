const Exam = require("../models/Exam")
const ExamData = require("../models/ExamData")
const Group = require("../models/Group")
const Sheet = require("../models/Sheet")

const examController = {}

examController.getExamsByGroup = async (req, res) => {
  try {
    const exams = await ExamData.find({ group: req.params.groupId })
      .populate('group')
      .populate('sheet', { description: 1 })
    return res.json({ success: true, exams })
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
} 

examController.createExam = async (req, res) => {
  const {sheet, group, startDate, endDate, type, different} = req.body
  
  if(!sheet || !group) {
    return res.json({
      success: false,
      message: "Faltan los parametros sheet y group"
    })
  }
    
  try { 
    const data = await ExamData.create({
      sheet, group, startDate, endDate, type, different
    })

    const foundGroup = await Group.findById(data.group).populate('students')
    
    let examsForm = []

    for (let i = 0; i < foundGroup.students.length; i++) {
      const newExam = await Exam.create({
        examData: data._id, 
        student: foundGroup.students[i]._id,
        sheet
      })
      examsForm.push(newExam._id)
    }
    return res.json({ success:true, exam:data, examsForm })
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
}

examController.deleteExam = async (req, res) => {
  try { 
    const data = await ExamData.findByIdAndDelete(req.params.examId)
    const exams = await Exam.find({ examData: data._id })

    for(let i=0; i<exams.length; ++i) {
      const deletedExam = await Exam.findByIdAndDelete(exams[i]._id)
      if(!data.sheet.equals(deletedExam.sheet)) {
        await Sheet.findByIdAndDelete(deletedExam.sheet);
      }
    } 
    return res.json({ success:true, exam:data })
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
}

examController.getFormsExam = async (req, res) => {
  try {
    const exams = await Exam.find({student: req.params.studentId}).populate({
      path: 'examData',
      populate: [{ path: 'sheet', select: 'description'}, { path: 'group', select: 'name'}],
    })

    return res.json({success:true, exams})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.getExam = async (req, res) => {
  try {
    const exam = await ExamData.findById(req.params.examId)
      .populate({path: 'sheet', select: 'description'})
      .populate({path: 'group', select: 'name'})
    return res.json({success:true, exam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.getKardex = async (req, res) => {
  const {student, group} = req.body
  try {
    const exams = await Exam.find({student, group}).populate({
      path: 'examData',
      populate: [{ path: 'sheet', select: 'description'}, { path: 'group', select: 'name'}],
    }).populate('sheet')
    return res.json({success:true, exams})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.updateExam = async (req, res) => {
  const {startDate, endDate, type} = req.body
  try {
    const exam = await ExamData.findByIdAndUpdate(req.params.examId, 
      {startDate, endDate, type}, {new: true}).populate('group').populate('sheet', {description: 1})
    return res.json({success:true, exam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
} 

examController.getFormExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId).populate({
      path: 'examData',
      populate: [{ path: 'sheet'}, { path: 'group', select: 'name'}],
    }).populate('sheet')

    const today = new Date()
    const startDate = new Date(exam.examData.startDate)
    const endDate = new Date(exam.examData.endDate)

    if( today >= startDate  || !exam.isActive ) {
      return res.json({success:true, exam})
    } else {
      return res.json({success: false, message: 'El examen aún no ha comenzado.'})
    }
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.getExams = async (req, res) => {
  try {
    const exams = await Exam.find({examData: req.params.examId}).populate({
      path: 'examData',
      populate: [{ path: 'group', select: 'name'}],
    }).populate({
      path: 'student',
      select: 'name'
    })
    return res.json({success:true, exams})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.submitExam = async (req, res) => {
  const {exam, student, grade , answers, feedback, isActive} = req.body
  try {
    const foundExam = await ExamData.findById(exam)
    const today = new Date()
    const startDate = new Date(foundExam.startDate)
    const endDate = new Date(foundExam.endDate)

    const foundFormExam = await Exam.findById(req.params.examId)

    if(!foundFormExam.isActive) {
      return res.json({success: false, message: 'Ya has agotado tus intentos.'})
    }
    
    if(today < startDate || today > endDate) {
      return res.json({success: false, message: 'Fecha incorrecta.'})
    }

    const updatedExam = await Exam.findByIdAndUpdate(req.params.examId, {
      exam, student, grade, answers, feedback, isActive
    }, {new: true})

    return res.json({success:true, exam:updatedExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.updateApplyExam = async (req, res) => {
  const {exam, student, grade , answers, feedback, isActive} = req.body
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.examId, {
      exam, student, grade, answers, feedback, isActive
    }, {new: true}).populate({
      path: 'student',
      select: 'name'
    }).populate({
      path: 'examData',
      populate: [{ path: 'sheet', select: 'description'}, { path: 'group', select: 'name'}],
    }).populate('sheet')
    return res.json({success:true, exam:updatedExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.uploadImages = async (req, res) => {
  const {images} = req.body
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.examId, {images}, {new: true})
    .populate({
      path: 'examData',
      populate: [{ path: 'sheet'}, { path: 'group', select: 'name'}],
    }).populate('sheet')
      
    return res.json({success:true, exam: updatedExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.updateSheet = async (req, res) => {
  const {sheet} = req.body
  try {
    const updatedExam = await Exam.findByIdAndUpdate(req.params.examId, {sheet}, {new: true})
    return res.json({success:true, exam:updatedExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

module.exports = examController