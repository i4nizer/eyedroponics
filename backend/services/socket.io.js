const { Server } = require("socket.io");



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
    
    console.log(`ESP32 or client connected: ${socket.id}`);

    // Register individual event handlers
    socket.on("image", (imageBuffer) => onImage(socket, imageBuffer));
    socket.on("disconnect", () => onDisconnect(socket));
}

/**
 * Handles image data received from ESP32-CAM.
 * @param {import("socket.io").Socket} socket - The socket instance.
 * @param {Buffer} imageBuffer - The image data received from the ESP32-CAM.
 */
const onImage = (socket, imageBuffer) => {
    console.log(`Received image from ESP32: ${imageBuffer.length} bytes`);

    // Broadcast the image to all clients
    io.emit("image", imageBuffer);
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



module.exports = { io, attachWebSocketServer };
