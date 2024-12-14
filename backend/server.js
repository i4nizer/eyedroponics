const express = require('express')
const http = require('http')
const cors = require('cors')

const router = require('./routes/router')
const config = require('./config/config')
const database = require('./config/database.config')
const PDModel = require('./utils/pest-detection-model')
const { attachWebSocketServer } = require('./utils/socket.io')


// Initialize Express app
const app = express()

// Use middleware
const frontendDomain = `${config.frontendProtocol}://${config.frontendHost}:${config.frontendPort}`
app.use(cors({ origin: [frontendDomain, '*'], credentials: true }))
app.use('/api', router)


// Create an HTTP server and attach WebSocket server
const server = http.createServer(app)
attachWebSocketServer(server)


// Start the server
server.listen(config.backendPort, () => console.log(`Server running on ${config.backendProtocol}://${config.backendHost}:${config.backendPort}`))



database
    .connectDatabase()
    .then(() => console.log('Database Connected Successfully'))
    .catch((err) => console.error(err))

// PDModel.load()