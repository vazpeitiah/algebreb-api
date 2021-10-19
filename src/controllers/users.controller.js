const User = require('../models/User')
const Role = require('../models/Role')
const usersCtrl = {};


// Obtener todos los registros
usersCtrl.getUsers = async (req, res) => {
    const users = await User.find().populate('roles');
    res.send(users);
}

// Crear un nuevo registro
usersCtrl.createUser = async (req, res) => {
    const {name, username, password, roles, email} = req.body;
    
    const newUser = {
        username, password, email, name
    };

    const foundRoles = await Role.find({name: {$in: roles}})
    newUser.roles = foundRoles.map(role => role._id)

    const user = await User.create(newUser)
    res.json(user)
}

// Obtener un registro por su id
usersCtrl.getUser = async (req, res) => {
    const user = await User.findById(req.params.userID).populate('roles');
    res.json(user);
}

// Actualizar un registro
usersCtrl.updateUser = async (req, res) => {
    const {name, username, password, roles, email} = req.body;

    const newUser = {
        username, password, email, name
    };

    const foundRoles = await Role.find({name: {$in: roles}})
    newUser.roles = foundRoles.map(role => role._id)

    console.log(newUser)

    await User.findByIdAndUpdate(req.params.userID, newUser);
    res.json({message: 'User Updated'})
}

// Eliminar un registro
usersCtrl.deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.params.userID);
    res.send('User deleted')
}

module.exports = usersCtrl;