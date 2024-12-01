#ifndef HTTP_FUNCS_H
#define HTTP_FUNCS_H

#include "http_config.h"


/**
 * Acts as callback function to POST the image captured.
 */
void http_send_image_cb(camera_fb_t *fb)
{
    // Check buffer
    if (!fb || !fb->buf)
    {
        log_error("HTTP", "Frame buffer is null.");
        return;
    }

    // Check internet
    if (!wifi_connected) 
    {
        log_error("HTTP", "Failed to send image, not connected to WiFi.");
        return;
    }

    HTTPClient http;
    http.begin(http_endpoint); // Replace with your server endpoint

    String boundary = "----ESP32CAMBoundary";
    String bodyStart = "--" + boundary + "\r\n"
                                         "Content-Disposition: form-data; name=\"image\"; filename=\"image.jpg\"\r\n"
                                         "Content-Type: image/jpeg\r\n\r\n";
    String bodyEnd = "\r\n--" + boundary + "--\r\n";

    // Combine the entire payload
    size_t totalLength = bodyStart.length() + fb->len + bodyEnd.length();
    uint8_t *payload = (uint8_t *)malloc(totalLength);

    if (!payload)
    {
        log_error("HTTP", "Failed to allocate memory for the payload.");
        return;
    }

    // Copy data into the payload buffer
    memcpy(payload, bodyStart.c_str(), bodyStart.length());
    memcpy(payload + bodyStart.length(), fb->buf, fb->len);
    memcpy(payload + bodyStart.length() + fb->len, bodyEnd.c_str(), bodyEnd.length());

    // Set headers
    http.addHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    http.addHeader("Content-Length", String(totalLength));
    
    // Include an existing api key
    if (http_api_key) http.addHeader("x-api-key", http_api_key);

    // Send POST request
    int code = http.POST(payload, totalLength);

    // Handle response
    if (code > 0)
    {
        log_success("HTTP", "Image sent successfully.");
        Serial.printf("[SUCCESS] [HTTP] Response code: %d\n", code);
    }
    else
    {
        log_error("HTTP", "Failed to send image.");
        Serial.printf("[ERROR]   [HTTP] Error: %s\n", http.errorToString(code).c_str());
    }

    // Clean up
    free(payload);
    http.end();
}

/**
 * Captures and sends the image.
 */
void http_send_image_capture()
{
    camera_capture(http_send_image_cb);
}

/**
 * Used as task that sends image based on set interval.
 */
void http_send_image_capture(void *parameter)
{
    while(true) {

        int start = millis();
        
        camera_capture(http_send_image_cb);
        
        int end = millis();
        log_info("HTTP", String("HTTP Task finished in " + String(end - start) + "ms with " + String(http_send_interval) + "ms interval.").c_str());
        
        vTaskDelay(http_send_interval);
    }
}

/**
 * Creates and starts a task that invokes http_send_image_capture.
 */
void http_start_task()
{
    log_info("HTTP", "HTTP Task started.");
    xTaskCreate(http_send_image_capture, "HTTP Task", 12000, NULL, 1, NULL);
}


#endif