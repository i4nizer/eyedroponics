#ifndef CAMERA_CONFIG_H
#define CAMERA_CONFIG_H

#include "esp_camera.h"
#include "camera_pins.h"
#include "../logger/logger_funcs.h"

#define CONFIG_ESP32_SPIRAM_SUPPORT 1

/** Camera Status */
bool camera_initialized = false;

/**
 * Camera pins configuration.
 * 
 * Resolutions:
 *  FRAMESIZE_QQVGA:     160 x 120
 *  FRAMESIZE_QVGA:      320 x 240
 *  FRAMESIZE_VGA:       640 x 480
 *  FRAMESIZE_SVGA:      800 x 600
 *  FRAMESIZE_XGA:       1024 x 768
 *  FRAMESIZE_UXGA:      1600 x 1200
 */
static camera_config_t camera_config = {
    .pin_pwdn = CAM_PIN_PWDN,
    .pin_reset = CAM_PIN_RESET,
    .pin_xclk = CAM_PIN_XCLK,
    .pin_sccb_sda = CAM_PIN_SIOD,
    .pin_sccb_scl = CAM_PIN_SIOC,

    .pin_d7 = CAM_PIN_D7,
    .pin_d6 = CAM_PIN_D6,
    .pin_d5 = CAM_PIN_D5,
    .pin_d4 = CAM_PIN_D4,
    .pin_d3 = CAM_PIN_D3,
    .pin_d2 = CAM_PIN_D2,
    .pin_d1 = CAM_PIN_D1,
    .pin_d0 = CAM_PIN_D0,
    .pin_vsync = CAM_PIN_VSYNC,
    .pin_href = CAM_PIN_HREF,
    .pin_pclk = CAM_PIN_PCLK,

    .xclk_freq_hz = 24000000,       // Higher clock frequency for better sharpness
    .ledc_timer = LEDC_TIMER_0,
    .ledc_channel = LEDC_CHANNEL_0,

    .pixel_format = PIXFORMAT_JPEG, // JPEG for best compression
    .frame_size = FRAMESIZE_UXGA,   // Higher resolution for better image quality
    .jpeg_quality = 8,              // Lower value for better JPEG quality
    .fb_count = 2,                  // More buffers for smoother captures
    .fb_location = CAMERA_FB_IN_PSRAM,
    .grab_mode = CAMERA_GRAB_WHEN_EMPTY // Optimal for continuous mode
};

#endif // CAMERA_CONFIG_H
