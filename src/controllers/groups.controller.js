const Group = require("../models/Group")
const User = require("../models/User")
const Role = require("../models/Role")
const Exam = require("../models/Exam")
const ApplyExam = require("../models/ApplyExam")
const Sheet = require('../models/Sheet')

const groupsController = {}

groupsController.getGroupsByTeacher = async (req, res) => {
  try {
    const groups = await Group.find({ teacher: req.params.userId }).populate("students")
    return res.json({ success:true, groups})
  } catch (err) {
    return res.json({ success:false, message: err.message })
  }
}

groupsController.getGroupsByStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    const groups = await Group.find().populate("teacher", {name:1, email:2})

    const studentGroups = groups.filter(group => group.students.includes(user._id))
    return res.json({ success:true, groups: studentGroups })
  } catch (err) {
    return res.json({ success:false, message: err.message })
  }
}

groupsController.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate("students")
    return res.json({ success:true, group })
  } catch (err) {
    return res.json({ success:false, message: err.message })
  }
}

groupsController.createGroup = async (req, res) => {
  const { name, teacher} = req.body

  if (!name || !teacher) {
    return res.json({
      success: false,
      message: "Proveer los parametros name y teacher",
    })
  }

  try {
    const group = await Group.create({ name, teacher })
    return res.json({ success: true, group })
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
}

groupsController.updateGroup = async (req, res) => {
  const { name, teacher, students } = req.body

  if(!name || !teacher || !students) {
    return res.json({
      success: false,
      message: "Proveer los parametros name, teacher y students",
    })
  }

  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.groupId,
      {
        name,
        teacher,
        students
      },
      { new: true }
    ).populate('students')
    return res.json({ success: true, group: updatedGroup })
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
}

groupsController.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.groupId)
    const exams = await Exam.find({group: group._id})

    for (let j = 0; j < exams.length; j++) {
      const deletedExam = await Exam.findByIdAndDelete(exams[j]._id)
      const arr = await ApplyExam.find({exam: deletedExam._id})
      for(let i=0; i<arr.length; ++i) {
        const deleted = await ApplyExam.findByIdAndDelete(arr[i]._id)
        if(!deletedExam.sheet.equals(deleted.sheet)) {
          await Sheet.findByIdAndDelete(deleted.sheet);
        }
      }
    }

    return res.json({ success: true, group })
  } catch (err) {
    return res.json({ success: false, message: err.message })
  }
}

groupsController.enrollStudent = async (req, res) => {
  const { student, groupId } = req.body
  
  if(!student || !groupId) {
    return res.json({
      success: false,
      message: "Proveer los parametros student y groupId",
    })
  }
  
  try {
    const userFound = await User.findOne({ username:student })
    const group = await Group.findById(groupId)
    if (userFound) {
      const foundRoles = await Role.find({ _id: { $in: userFound.roles } })
      const roles = foundRoles.map((role) => role.name)
      if (roles.includes("alumno")) {
        if (!group.students.includes(userFound._id)) {
          group.students = [...group.students, userFound._id]
          delete group._id
          const groupUpdated = await Group.findByIdAndUpdate(group._id, {...group}, {new: true}).populate('students')
          return res.json({ success: true, group:groupUpdated})
        } else {
          return res.json({ success: false, message: "El usuario ya esta inscrito en este grupo" })
        }
      } else {
        return res.json({ success: false, message: "El usuario no es de tipo alumno" })
      }
    } else {
      return res.json({ success: false, message: "Usuario no encontrado" })
    }
  } catch (err) {
    return res.json({ success: false, message: "Clave de acceso no valida" })
  }
}

module.exports = groupsController