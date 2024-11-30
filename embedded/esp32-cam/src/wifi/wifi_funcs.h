#ifndef WIFI_FUNCS_H
#define WIFI_FUNCS_H

#include "wifi_config.h"

/**
 * Calls WiFi.begin() and logs messages.
 */
void wifi_connect()
{
    WiFi.begin(wifi_ssid, wifi_psk);
    wifi_connected = false;

    log_info("WIFI", "WiFi started connecting.");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
    }

    log_success("WIFI", "WiFi connected successfully.");
    wifi_connected = true;
}

#endif