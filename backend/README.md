### Installation (Developers)

-   Create a .env file under eyedroponics folder
-   Create these variables:
    -   PORT
    -   DB_PASSWORD
    -   API_KEY
    -   ACCESS_KEY
    -   REFRESH_KEY
-   The values for these variables are private

### There are two express server file here

-   api.js Contains just Express server only.
-   server.js Contains both Express server and an attached WebSocket server.

### There are also two WebSocket server here

-   services/socket.io.js This WebSocket uses socket.io library.
-   services/websocket.js This WebSocket uses the standard WebSocket library.

##### Issue with WebSocket from ESP32-Cam to backend WebSocket

Sadly Esp32-Cam can't connect to either standard WebSocket or socket.io library.
In standard WebSocket, the WebSocket server receives the connection and disconnects immediately while the event triggered in Esp32-Cam is only the disconnected event. In socket.io, there is not a single hint of connection. The code for these websockets are kept in services folder and the logic handling them is in the server.js file.
