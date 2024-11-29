### There are two express server file here
 - api.js Contains just Express server only.
 - server.js Contains both Express server and an attached WebSocket server.

### There are also two WebSocket server here
 - services/socket.io.js This WebSocket uses socket.io library.
 - services/websocket.js This WebSocket uses the standard WebSocket library.

##### Sadly Esp32-Cam can't connect to either WebSocket library
##### In socket.io, there is not a single hint of connection.
##### In standard WebSocket, the WebSocket server receives the connection and disconnects immediately while the event triggered in Esp32-Cam is only the disconnected event.