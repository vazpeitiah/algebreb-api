require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const {createRoles} = require('./config/initialSetup') 

const app = express()

require('./database')

createRoles() // Crear roles por defeto (alumno y profesor)
    
// settings
app.set('port', process.env.PORT || 5000)

// middlewares
app.use(morgan('dev')); //Para mostrar las peticiones en consola
app.use(express.json())
app.use(cors())

// routes
app.get('/', (req, res) => res.send('Welcome to algebreb API'))
app.use('/auth', require('./routes/auth.route'))
app.use('/users', require('./routes/users.route'))
app.use('/sheets', require('./routes/sheets.route'))
app.use('/groups', require('./routes/groups.route'))
app.use('/exams', require('./routes/exam.route'))


// start server
app.listen(app.get('port'), () => console.log('server started listening on port', app.get('port')))