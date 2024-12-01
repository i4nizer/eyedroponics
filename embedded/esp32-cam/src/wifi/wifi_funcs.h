#ifndef WIFI_FUNCS_H
#define WIFI_FUNCS_H

#include "WiFi.h"
#include "wifi_config.h"


void wifi_onconnect(arduino_event_id_t event, arduino_event_info_t info)
{
    if (event == ARDUINO_EVENT_WIFI_STA_GOT_IP)
    {
        log_success("WIFI", "WiFi connected successfully.");
        wifi_connected = true;
    }
}

void wifi_ondisconnect(arduino_event_id_t event, arduino_event_info_t info)
{
    if (event == ARDUINO_EVENT_WIFI_STA_DISCONNECTED)
    {
        log_error("WIFI", "WiFi disconnected.");
        wifi_connected = false;

        // Optionally reconnect
        log_info("WIFI", "Attempting to reconnect...");
        WiFi.begin(wifi_ssid, wifi_psk);
    }
}

// Connect to WiFi and set up event handlers
void wifi_connect()
{
    WiFi.onEvent(wifi_onconnect, ARDUINO_EVENT_WIFI_STA_GOT_IP);
    WiFi.onEvent(wifi_ondisconnect, ARDUINO_EVENT_WIFI_STA_DISCONNECTED);

    WiFi.begin(wifi_ssid, wifi_psk);
    wifi_connected = false;

    log_info("WIFI", "WiFi started connecting.");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
    }
}

#endif
