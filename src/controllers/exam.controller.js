const { json } = require("body-parser")
const ApplyExam = require("../models/ApplyExam")
const Exam = require("../models/Exam")
const Group = require("../models/Group")


const examController = {}

examController.getExamsByGroup = async (req, res) => {
  try {
    const exams = await Exam.find({group: req.params.groupId}).populate('group').populate('sheet', {description: 1})
    return res.json({success:true, exams})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
} 

examController.createExam = async (req, res) => {
  const {sheet, group, startDate, endDate, type} = req.body
  
  if(!sheet || !group)
    return res.json({success: false, message: "Faltan los parametros sheet y group"})

  try { 
    const newExam = await Exam.create({
      sheet, group, startDate, endDate, type
    })

    const foundGroup = await Group.findById(newExam.group).populate('students')

    foundGroup.students.forEach(async (student) => {
      await ApplyExam.create({
        exam: newExam._id, 
        student: student._id, 
       })
    });

    return res.json({success:true, exam:newExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.deleteExam = async (req, res) => {
  try { 
    const deletedExam = await Exam.findByIdAndDelete(req.params.examId)

    const arr = await ApplyExam.find({exam: deletedExam._id})

    for(let i=0; i<arr.length; ++i) {
      await ApplyExam.findByIdAndDelete(arr[i]._id)
    } 

    return res.json({success:true, exam:deletedExam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.getApplyExam = async (req, res) => {
  try {
    const exams = await ApplyExam.find({student: req.params.studentId}).populate({
      path: 'exam',
      populate: [{ path: 'sheet', select: 'description'}, { path: 'group', select: 'name'}],
    })
    return res.json({success:true, exams})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

examController.getSingleApply = async (req, res) => {
  try {
    const exam = await ApplyExam.findById(req.params.examId).populate({
      path: 'exam',
      populate: [{ path: 'sheet'}, { path: 'group', select: 'name'}],
    })
    return res.json({success:true, exam})
  } catch (err) {
    return res.json({success: false, message: err.message})
  }
}

module.exports = examController