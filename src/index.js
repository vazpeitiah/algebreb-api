require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const {createRoles} = require('./config/initialSetup') 

const app = express()

require('./database') // Mongoose settings

createRoles() // Crear roles por defeto (alumno y profesor)
    
// settings
app.set('port', process.env.PORT || 4000)

// middlewares
app.use(morgan('dev')); //Para mostrar las peticiones en consola
app.use(express.json())
app.use(cors())

// routes
app.get('/', (req, res) => res.send('Welcome to algebreb API'))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/users', require('./routes/users.route'))

// start server
app.listen(app.get('port'), () => console.log('server started listening on port', app.get('port')))