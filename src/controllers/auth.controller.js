const User = require('../models/User')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken')

// Iniciar sesion para devolver un token valido
exports.signin = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !password) {
        return res.json({ success: false, message: 'Please provide an username and password' }) // make middleware to handdle error
    }

    try {
        const user = await User.findOne({ username })

        
         
        if (!user) {
            return res.json({ success: false,  message: 'Invalid username' })
        }

        const isMatch = await user.isValidPassword(password)

        if (isMatch == false) {
            return res.json({ success: false,  message: 'Invalid password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 // 24 horas
        })

        const usrData = {
            name: user.name,
            username,
            email: user.email,
            token
        }

        const foundRoles = await Role.find({_id: {$in: user.roles}})
        usrData.roles = foundRoles.map(role => role.name)

        return res.status(200).json({ success: true, user: usrData })

    } catch (err) {
        return res.json({success: false, message:err.messasge})
    }
}
// Registrar cuenta de usuario nueva, devuelve un token valido
exports.signup = async (req, res, next) => {
    const {name, username, password, email, roles} = req.body

    if (!username || !password || !email || !roles) {
        return res.json({success: false, message: 'Please provide an username, password, email and the role of the user' }) // make middleware for handdle error
    }

    try {

        const newUser = {
            name, username, password, email
        }
    
        const foundRoles = await Role.find({name: {$in: roles}})
        newUser.roles = foundRoles.map(role => role._id)

        const user = await User.create(newUser) // Arreglar para ver nombre de usuario ya existente
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 // 24 horas
        })

        const usrData = {
            name: user.name,
            username,
            email: user.email,
            token
        }

        const froles = await Role.find({_id: {$in: user.roles}})
        usrData.roles = froles.map(role => role.name)

        return res.json({ success: true, user:usrData})

    } catch (err) {
        return res.json({success: false, message: err.message})
    }
}

// Verificar si un token es valido o no ha expirado
exports.verifyToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.json({success: false, message: "Provide a token" })
    }
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) {
            return res.json({ success: false, meesage: "Invalid token"})
        }

        return res.json({ success: true, message: token })
    } catch (err) {

        return res.json({ success: false, message: err.message })
        //next(err)
    }
}