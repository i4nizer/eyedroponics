const express = require('express')
const cors = require('cors')

const router = require('./routes/router')
const config = require('./config/config')
const database = require('./config/database.config')


// Initialize Express app
const app = express()

// Use middleware
app.use(cors({ origin: ['http://localhost:3000', '*'], credentials: true }))
app.use('/api', router)


// Start the server
app.listen(config.backendPort, () => console.log(`Server running on ${config.backendProtocol}://${config.backendHost}:${config.backendPort}`))


database
    .connectDatabase()
    .then(() => console.log('Database Connected Successfully'))
    .catch((err) => console.error(err))