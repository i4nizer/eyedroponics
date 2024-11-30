#ifndef CAMERA_FUNCS_H
#define CAMERA_FUNCS_H

#include "camera_config.h"

/**
 * Initializes the camera configuration.
 */
esp_err_t camera_init()
{
    // Power up the camera if PWDN pin is defined
    if (CAM_PIN_PWDN != -1)
    {
        pinMode(CAM_PIN_PWDN, OUTPUT);
        digitalWrite(CAM_PIN_PWDN, LOW);
    }

    // Initialize the camera configuration
    esp_err_t err = esp_camera_init(&camera_config);
    if (err != ESP_OK)
    {
        log_error("CAM", "Camera initialization failed.");
        camera_initialized = false;
        return err;
    }
    
    log_success("CAM", "Camera initialized successfully.");
    camera_initialized = true;
    return ESP_OK;
}

/**
 * Captures to test the camera.
 */
esp_err_t camera_test()
{
    // acquire a frame
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb)
    {
        log_error("CAM", "Camera capture failed.");
        return ESP_FAIL;
    }

    // replace this with your own function
    log_success("CAM", "Camera captured successfully.");

    // return the frame buffer back to the driver for reuse
    esp_camera_fb_return(fb);
    return ESP_OK;
}

#include <esp_camera.h>
#include "esp_err.h"

/**
 * Captures camera and processes the frame buffer using a callback.
 *
 * @param process_callback Function pointer to process the frame buffer.
 *                         The callback should take a `camera_fb_t*` as a parameter.
 * @return esp_err_t ESP_OK on success or an error code on failure.
 */
esp_err_t camera_capture(void (*process_callback)(camera_fb_t *))
{
    // acquire a frame
    camera_fb_t *fb = esp_camera_fb_get();
    if (!fb)
    {
        log_error("CAM", "Camera capture failed.");
        return ESP_FAIL;
    }
    else 
    {
        log_success("CAM", "Camera captured successfully.");
    }

    // Process the frame buffer with the provided callback, if any
    if (process_callback)
    {
        process_callback(fb);
    }
    else
    {
        log_warn("CAM", "No callback provided to process the frame buffer.");
    }

    // return the frame buffer back to the driver for reuse
    esp_camera_fb_return(fb);
    return ESP_OK;
}


#endif