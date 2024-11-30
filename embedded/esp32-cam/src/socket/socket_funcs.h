#ifndef SOCKET_FUNCS_H
#define SOCKET_FUNCS_H

#include "socket_config.h"
#include "../logger/logger_funcs.h"

/**
 * Callback for WebSocket events.
 */
void socket_event(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_DISCONNECTED:
        log_info("SOCKET", "Disconnected from WebSocket server.");
        break;

    case WStype_CONNECTED:
        log_info("SOCKET", "Connected to WebSocket server.");
        break;

    case WStype_TEXT:
        Serial.printf("[INFO]    [SOCKET] Message from server: %s\n", payload);
        break;

    case WStype_BIN:
        Serial.printf("[INFO]    [SOCKET] Binary data received (%u bytes).\n", length);
        break;

    case WStype_FRAGMENT_TEXT_START:
        log_info("SOCKET", "Text fragment start received.");
        break;

    case WStype_FRAGMENT_BIN_START:
        log_info("SOCKET", "Binary fragment start received.");
        break;

    case WStype_FRAGMENT:
        Serial.printf("[INFO]    [SOCKET] Fragment received (%u bytes).\n", length);
        break;

    case WStype_FRAGMENT_FIN:
        log_info("SOCKET", "Fragmentation completed.");
        break;

    case WStype_PING:
        log_info("SOCKET", "Ping received.");
        break;

    case WStype_PONG:
        log_info("SOCKET", "Pong received.");
        break;

    case WStype_ERROR:
        log_error("SOCKET", "Error encountered in WebSocket.");
        break;

    default:
        log_warn("SOCKET", "Unhandled WebSocket event type.");
        break;
    }
}

/**
 * Starts connecting to WebSocket.
 */
void socket_connect()
{
    log_info("SOCKET", "WebSocket started connecting.");
    
    // socket.begin(socket_server, socket_port, "/");
    
    socket.beginSocketIO(socket_server, socket_port, "/");

    socket.onEvent(socket_event);

    // socket.setAuthorization("x-api-key", socket_api_key);

    // socket.setReconnectInterval(socket_reconnect_interval);
}

/**
 * Acts as callback function to send the image captured through WebSocket.
 */
void socket_send_image_cb(camera_fb_t *fb)
{
    // Check buffer
    if (!fb || !fb->buf || fb->len <= 0)
    {
        Serial.println("Invalid frame buffer. Cannot send image.");
        return;
    }

    // Send image data through WebSocket
    // Split into chunks if necessary to handle large data
    size_t chunkSize = 1024;    // WebSocket frame size limit for each chunk
    size_t totalBytes = fb->len;
    size_t bytesSent = 0;

    while (bytesSent < totalBytes)
    {
        size_t bytesToSend = min(chunkSize, totalBytes - bytesSent);
        socket.sendBIN(fb->buf + bytesSent, bytesToSend);
        bytesSent += bytesToSend;
    }   

    Serial.printf("[SUCCESS] [SOCKET] Sent %zu bytes of image data via WebSocket.\n", fb->len);
}

#endif