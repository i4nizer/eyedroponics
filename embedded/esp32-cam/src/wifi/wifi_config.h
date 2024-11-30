#ifndef WIFI_CONFIG_H
#define WIFI_CONFIG_H

#include <WiFi.h>
#include "../camera/camera_funcs.h"

/** WiFi credentials */
const char *wifi_ssid = "arc";
const char *wifi_psk = "12345678";

/** WiFi Status */
bool wifi_connected = false;


#endif