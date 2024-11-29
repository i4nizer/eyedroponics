const express = require('express')
const cors = require('cors')

const router = require('./routes/router')
const config = require('./config/config')
const database = require('./config/database.config')


// Initialize Express app
const app = express()

// Use middleware
app.use(cors({ origin: '*', credentials: true }))
app.use('/api', router)


// Start the server
app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`))


// database
//     .connectDatabase()
//     .then(() => console.log('Database Connected Successfully'))
//     .catch((err) => console.error(err))