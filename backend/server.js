const express = require('express')
const http = require('http')
const cors = require('cors')

const router = require('./routes/router')
const config = require('./config/config')
const database = require('./config/database.config')
const PDModel = require('./utils/pest-detection-model')
const { attachWebSocketServer } = require('./services/socket.io')


// Initialize Express app
const app = express()

// Use middleware
app.use(cors({ origin: ['http://localhost:3000', '*'], credentials: true }))
app.use('/api', router)


// Create an HTTP server and attach WebSocket server
const server = http.createServer(app)
attachWebSocketServer(server)


// Start the server
server.listen(config.port, () => console.log(`Server running on http://localhost:${config.port}`))



database
    .connectDatabase()
    .then(() => console.log('Database Connected Successfully'))
    .catch((err) => console.error(err))

PDModel.load()