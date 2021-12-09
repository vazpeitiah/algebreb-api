const { json } = require("body-parser")
const ApplyExam = require("../models/ApplyExam")
const Exam = require("../models/Exam")
const Group = require("../models/Group")
const Sheet = require("../models/Sheet")


const examController = {}

const getDuration = (sdate, edate) => {
  const startDate = new Date(sdate)
  const endDate = new Date(edate)

  let diffTime = Math.abs(startDate - endDate)  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  diffTime = diffTime %  (1000 * 60 * 60 * 24);
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  diffTime = diffTime %  (1000 * 60 * 60);
  const diffMin = Math.floor(diffTime / (1000 * 60))
  
  let str = ''
  
  if(diffDays !== 0) {
    if(diffDays === 1) {
      str += `${diffDays} día ` 
    } else {
      str += `${diffDays} días `
    }
  }
  
  if(diffHours !== 0) {
    if(diffHours === 1) {
      str += `${diffHours} hr `
    } else {
      str += `${diffHours} hrs `
    }
  }
  
 if(diffMin !== 0) {
    str += `${diffMin} min`
  }
  
  return str
}


examController.getExamsByGroup = async (req, res) => {
  try {
    const exams = await Exam.find({group: req.params.groupId}).populate('group').populate('sheet', {description: 1})
    const nexams = exams.map( form => ({...form._doc, duration: getDuration(form._doc.startDate, form._doc.endDate)}))
    return res.json({success:true, exams:nexams})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
} 

examController.createExam = async (req, res) => {
  const {sheet, group, startDate, endDate, type, different} = req.body
  
  if(!sheet || !group)
    return res.json({success: false, message: "Faltan los parametros sheet y group"})

  try { 
    const newExam = await Exam.create({
      sheet, group, startDate, endDate, type, different
    })

    const foundGroup = await Group.findById(newExam.group).populate('students')
    
    let examsForm = []

    for (let i = 0; i < foundGroup.students.length; i++) {
      const newApplyExam = await ApplyExam.create({
        exam: newExam._id, 
        student: foundGroup.students[i]._id,
        sheet
      })
      examsForm.push(newApplyExam._id)
    }

/*     foundGroup.students.forEach(async (student) => {
      await ApplyExam.create({
        exam: newExam._id, 
        student: student._id, 
       })
    });
 */
    return res.json({success:true, exam:newExam, examsForm})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.deleteExam = async (req, res) => {
  try { 
    const deletedExam = await Exam.findByIdAndDelete(req.params.examId)

    const arr = await ApplyExam.find({exam: deletedExam._id})

    for(let i=0; i<arr.length; ++i) {
      const deleted = await ApplyExam.findByIdAndDelete(arr[i]._id)
      if(!deletedExam.sheet.equals(deleted.sheet)) {
        await Sheet.findByIdAndDelete(deleted.sheet);
      }
    } 

    return res.json({success:true, exam:deletedExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.getFormsExam = async (req, res) => {
  try {
    const exams = await ApplyExam.find({student: req.params.studentId}).populate({
      path: 'exam',
      populate: [{ path: 'sheet', select: 'description'}, { path: 'group', select: 'name'}],
    })

    const nexams = exams.map( form => ({...form._doc, duration: getDuration(form._doc.exam.startDate, form._doc.exam.endDate)}))

    return res.json({success:true, exams: nexams})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.examId)
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
    const exams = await ApplyExam.find({student, group}).populate({
      path: 'exam',
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
    const exam = await Exam.findByIdAndUpdate(req.params.examId, 
      {startDate, endDate, type}, {new: true}).populate('group').populate('sheet', {description: 1})
    return res.json({success:true, exam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
} 

examController.getFormExam = async (req, res) => {
  try {
    const exam = await ApplyExam.findById(req.params.examId).populate({
      path: 'exam',
      populate: [{ path: 'sheet'}, { path: 'group', select: 'name'}],
    }).populate('sheet')

    const today = new Date()
    const startDate = new Date(exam.exam.startDate)
    const endDate = new Date(exam.exam.endDate)

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
    const exams = await ApplyExam.find({exam: req.params.examId}).populate({
      path: 'exam',
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
    const foundExam = await Exam.findById(exam)
    const today = new Date()
    const startDate = new Date(foundExam.startDate)
    const endDate = new Date(foundExam.endDate)

    const foundFormExam = await ApplyExam.findById(req.params.examId)

    if(!foundFormExam.isActive) {
      return res.json({success: false, message: 'Ya has agotado tus intentos.'})
    }
    
    if(today < startDate || today > endDate) {
      return res.json({success: false, message: 'Fecha incorrecta.'})
    }

    const updatedExam = await ApplyExam.findByIdAndUpdate(req.params.examId, {
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
    const updatedExam = await ApplyExam.findByIdAndUpdate(req.params.examId, {
      exam, student, grade, answers, feedback, isActive
    }, {new: true}).populate({
      path: 'student',
      select: 'name'
    }).populate({
      path: 'exam',
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
    const updatedExam = await ApplyExam.findByIdAndUpdate(req.params.examId, {images}, {new: true})
    .populate({
      path: 'exam',
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
    const updatedExam = await ApplyExam.findByIdAndUpdate(req.params.examId, {sheet}, {new: true})
    return res.json({success:true, exam:updatedExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

module.exports = examController