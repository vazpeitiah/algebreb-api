const Group = require('../models/Group')

const groupsController = {}

groupsController.getGroupsByUserId = async (req, res, next) => {
  const userId = req.params.userId
  
  if(!userId) {
    return res.json({success: false, message: "Falta el paramétro UserID"})
  }
  const groups = Group.find({teacher: userId})
  
  return res.json({success:true, groups})
}

groupsController.createGroup = async(req, res, next) => {

}

groupsController.updateGroup = async(req, res, next) => {

}

groupsController.deleteGroup = async(req, res, next) => {

}

module.exports = groupsController