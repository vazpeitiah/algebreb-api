// Crear roles por defecto
const Role = require('../models/Role')

exports.createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount()

        if (count > 0) return;

        const values = await Promise.all([
            Role.create({ name: "admin" }),
            Role.create({ name: "profesor" }),
            Role.create({ name: "alumno" })
        ])
        console.log('Creando roles de usuarios...')
        console.log(values)
    } catch (err) {
        console.log(err)
    }
}