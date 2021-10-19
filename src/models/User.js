const {Schema, model} = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        ref: "Role", 
        type: Schema.Types.ObjectId
    }]
})

//Guarda la clave cifrada en la base de datos 
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
})

//Valida si las claves coinciden
userSchema.methods.isValidPassword = function (password) {
    return bcrypt.compare(password, this.password)
}

module.exports = model('User', userSchema)