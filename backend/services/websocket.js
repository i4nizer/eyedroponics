const WebSocket = require('ws')



/**
 * Handles a new WebSocket connection.
 * @param {WebSocket} ws - The connected WebSocket instance.
 * @param {WebSocket.Server} wss - The WebSocket server instance.
 */
const onConnection = (ws, wss) => {
    console.log('A WebSocket client connected.')

    // Register message event handler
    ws.on('message', (data) => onMessage(ws, wss, data))

    // Register close event handler
    ws.on('close', () => onDisconnect(ws))
}

/**
 * Handles incoming messages from the WebSocket client.
 * @param {WebSocket} ws - The WebSocket instance.
 * @param {WebSocket.Server} wss - The WebSocket server instance.
 * @param {Buffer|string} data - The data received from the client.
 */
const onMessage = (ws, wss, data) => {
    try {
        const parsedData = JSON.parse(data) // Assuming JSON-encoded messages
        if (parsedData.event === 'image' && parsedData.payload) {
            console.log(`Received image from: ${parsedData.payload.length} bytes`)

            // Broadcast the image to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ event: 'image', payload: parsedData.payload }))
                }
            })
        }
    } catch (err) { console.error('Error processing message:', err.message) }
}

/**
 * Handles a WebSocket disconnection.
 * @param {WebSocket} ws - The disconnected WebSocket instance.
 */
const onDisconnect = (ws) => console.log('Client disconnected.')

/**
 * Attaches the WebSocket server to the provided HTTP server.
 * @param {import('http').Server} server - The HTTP server instance to attach the WebSocket server to.
 */
const attachWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server })

    // Register the connection event handler
    wss.on('connection', (ws) => onConnection(ws, wss))

    console.log('WebSocket (ws) server attached.')
    return wss
}



module.exports = { attachWebSocketServer }
