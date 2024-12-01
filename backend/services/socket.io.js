const { Server } = require("socket.io");


// Store the socketids using device apikeys
const socketMap = new Map();



// Create the WebSocket server instance
const io = new Server({
    cors: {
        origin: "*", // Adjust this to match your frontend domain
        methods: ["GET", "POST"],
    },
});

/**
 * Handles a new WebSocket connection.
 * @param {import("socket.io").Socket} socket - The connected socket instance.
 */
const onConnection = (socket) => {
    
    console.log(`Client connected: ${socket.id}`);

    // image-<apiKey> postfix for the emit
    socket.on('register', (apiKey) => socketMap.set(apiKey, socket))
    socket.on('unregister', (apiKey) => socketMap.delete(apiKey))
    
    socket.on("disconnect", () => onDisconnect(socket));
}

/**
 * @param {string} key ApiKey of the device
 */
const emitOnApiKey = (key, args) => {
    const socket = socketMap.get(key);
    if (!socket) return;

    socket.emit(`image-${key}`, args)
}

/**
 * Handles a WebSocket disconnection.
 * @param {import("socket.io").Socket} socket - The disconnected socket instance.
 */
const onDisconnect = (socket) => console.log(`Client disconnected: ${socket.id}`);

/**
 * Attaches the WebSocket server to the provided HTTP server.
 * @param {import('http').Server} server - The HTTP server instance to attach the WebSocket server to.
 */
const attachWebSocketServer = (server) => {
    io.attach(server);

    // Register the connection event handler
    io.on("connection", onConnection);

    console.log("WebSocket (socket.io) attached to the server.")
}



module.exports = { io, emitOnApiKey, attachWebSocketServer };
