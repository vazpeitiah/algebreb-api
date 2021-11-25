const Group = require("../models/Group")
const User = require("../models/User")
const Role = require("../models/Role")

const groupsController = {}

groupsController.getGroupsByUserId = async (req, res) => {
  const groups = await Group.find({ teacher: req.params.userId }).populate("students")
  return res.json(groups)
}

groupsController.getGroupsByStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.studentId)
    const groups = await Group.find().populate("teacher", {name:1, email:2})

    const groupsOfStudent = groups.filter(group => group.students.includes(user._id))
    return res.json({ success:true, groups: groupsOfStudent })
  } catch (err) {
    return res.json({ success:false, message: err.message })
  }
}

groupsController.getGroupById = async (req, res) => {
  const group = await Group.findById(req.params.groupId).populate("students")
  return res.json(group)
}

groupsController.createGroup = async (req, res) => {
  const { name, teacher, isOpen} = req.body

  if (!name || !teacher || isOpen === null || isOpen === undefined) {
    return res.json({
      success: false,
      message: "Proveer los parametros name, teacher y isOpen",
    })
  }

  const newGroup = await Group.create({ name, teacher, isOpen })
  res.json(newGroup)
}

groupsController.updateGroup = async (req, res) => {
  const { name, teacher, students, isOpen } = req.body
  const updatedGroup = await Group.findByIdAndUpdate(
    req.params.groupId,
    {
      name,
      teacher,
      students,
      isOpen,
    },
    { new: true }
  ).populate('students')
  return res.json(updatedGroup)
}

groupsController.deleteGroup = async (req, res) => {
  const deletedGroup = await Group.findByIdAndDelete(req.params.groupId)
  return res.json(deletedGroup)
}

groupsController.enrollStudent = async (req, res) => {
  const { student, groupId } = req.body
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
          return res.json({ success: false, message: "El usuario ya está inscrito en este grupo" })
        }
      } else {
        return res.json({ success: false, message: "El usuario no es de tipo alumno" })
      }
    } else {
      return res.json({ success: false, message: "Usuario no encontrado" })
    }
  } catch (err) {
    return res.json({ success: false, message: "Clave de acceso no válida" })
  }
}

module.exports = groupsController