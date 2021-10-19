const User = require('../models/User')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken')

// Iniciar sesion para devolver un token valido
exports.signin = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username || !password) {
        return res.json({ message: 'Please provide an username and password' }) // make middleware to handdle error
    }

    try {
        const user = await User.findOne({ username })

        if (!user) {
            return res.json({ message: 'Invalid username' })
        }

        const isMatch = await user.isValidPassword(password)

        if (isMatch == false) {
            return res.json({ message: 'Invalid password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 // 24 horas
        })

        return res.status(200).json({ succes: true, token })

    } catch (err) {
        next(err)
    }
}
// Registrar cuenta de usuario nueva, devuelve un token valido
exports.signup = async (req, res, next) => {
    const {name, username, password, email, roles} = req.body

    if (!username || !password || !email || !roles) {
        return res.json({ message: 'Please provide an username, password, email and the role of the user' }) // make middleware for handdle error
    }

    const newUser = {
        name, username, password, email
    }

    const foundRoles = await Role.find({name: {$in: roles}})
    newUser.roles = foundRoles.map(role => role._id)

    try {
        const user = await User.create(newUser) // Arreglar para ver nombre de usuario ya existente
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 // 24 horas
        })

        return res.json({ status: "success", token })

    } catch (err) {
        return res.json({ status: "error", message: err.message})
    }
}

// Verificar si un token es valido o no ha expirado
exports.verifyToken = async (req, res, next) => {
    const { token } = req.body;
    if (!token) {
        return res.json({ message: "Provide a token" })
    }
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) {
            return res.json({ status: "fail" })
        }

        return res.json({ status: "success" })
    } catch (err) {

        return res.json({ status: "fail", message: err.message })
        //next(err)
    }
}