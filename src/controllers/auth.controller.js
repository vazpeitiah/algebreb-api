const User = require('../models/User')
const Role = require('../models/Role')
const jwt = require('jsonwebtoken')

// Iniciar sesion para devolver un token valido
exports.signin = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.json({ 
            success: false, 
            message: 'Faltan los parametros email o username, y una clave' 
        })
    }

    try {
        const user = await User.findOne({ $or: [{username}, {email:username}] })

        if (!user) {
            return res.json({ success: false,  message: 'Usuario o email incorrecto' })
        }

        const isMatch = await user.isValidPassword(password)

        if (isMatch === false) {
            return res.json({ success: false,  message: 'Clave del usuario incorrecta' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 // 24 horas
        })

        const foundRoles = await Role.find({_id: {$in: user.roles}})

        const usrData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token,
            expiresIn: new Date(Date.now() + 60 * 60 * 24 * 1000), 
            roles: foundRoles.map(role => role.name)
        }

        return res.json({ success: true, user: usrData })
    } catch (err) {
        return res.json({success: false, message:err.message})
    }
}

// Registrar cuenta de usuario nueva, devuelve un token valido
exports.signup = async (req, res) => {
    const {name, username, password, email, roles} = req.body

    if (!username || !password || !email || !roles) {
        return res.json({
            success: false,
            message: 'Faltan los parametros username, password, email y roles'
        })
    }

    try {
        const u1 = await User.findOne({username})

        if(u1) {
            return res.json({
                success: false,
                message: 'Ya existe un usuario con ese nombre'
            })
        }

        const u2 = await User.findOne({email})

        if(u2) {
            return res.json({
                success: false,
                message: 'Ya existe un usuario con ese email'
            })
        }

        const foundRoles = await Role.find({name: {$in: roles}})

        if(!foundRoles) {
            return res.json({
                success: false,
                message: 'Rol invalido'
            })
        }

        const body = {
            name, username, password, email,
            roles: foundRoles.map(role => role._id)
        }

        const user = await User.create(body)
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 24 // 24 horas
        })

        const usrData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token,
            expiresIn: new Date(Date.now() + 60 * 60 * 24 * 1000),
            roles: foundRoles.map(role => role.name)
        }

        return res.json({ success: true, user:usrData })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

// Verificar si un token es valido o no ha expirado
exports.verifyToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.json({success: false, message: 'Necesita enviar un token' })
    }
    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET);
        if (!verify) {
            return res.json({ success: false, meesage: "Token invalido"})
        }

        return res.json({ success: true, message: token })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}

exports.updateProfile = async (req, res) => {
    const { username, passwd, name, email, password } = req.body
    // passwd -> password actual
    // password -> password nueva
    
    if(!username || !passwd || !email || !name) {
        return res.json({
            success: false,
            message: 'Necesitas enviar el parametro username, passwd, email y name'
        })
    }

    try {
        const user = await User.findOne({username})

        if(!user){
            return res.json({success: false, message: 'Usuario no encontrado'})
        }

        const isMatch = await user.isValidPassword(passwd)

        if(!isMatch) {
            return res.json({success: false, message: 'La contraseña es incorrecta'})
        }

        if(email !== user.email) {
            const u1 = await User.findOne({email})
            if(u1) {
                return res.json({success: false, message: 'Ya existe un usuario con este email'})
            }
        }

        user.email = email
        user.name = name

        if(password && password !== "") {
            user.password = password
        }
        
        await user.save()

        const usrData = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
        }
        return res.json({ success: true, user: usrData })
    } catch (err) {
        return res.json({ success: false, message: err.message })
    }
}