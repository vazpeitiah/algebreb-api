const jwt = require('jsonwebtoken');

const User = require('../models/User')
const Role = require('../models/Role')


// Para proteger rutas privadas
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token']
        if (token === undefined || token === null || token === "") {
            return res.json({
                status: false,
                message: "You hasn't access to this data"
            })
        }

        const auth = jwt.verify(token, process.env.JWT_SECRET);
        if (!auth) {
            return res.json({
                status: false,
                message: "You hasn't access to this data"
            })
        }

        req.userID = auth.id;

        const user = await User.findById(req.userID, { password: 0 })

        if (!user) return res.json({ message: 'User not found' })
        next();
    } catch (err) {
        return res.json({ status: "error", message: err.message })
    }

}

// Para saber si el usuario tiene el rol de administrador
exports.isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userID)
        const roles = await Role.find({ _id: { $in: user.roles } })

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                next()
                return;
            }
        }
        return res.json({ message: 'Require admin role' })
    } catch (err) {
        return res.json({ message: err.message })
    }

} 