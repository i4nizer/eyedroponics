#ifndef HTTP_CONFIG_H
#define HTTP_CONFIG_H

#include <HTTPClient.h>
#include "../wifi/wifi_funcs.h"

const char *http_endpoint = "http://192.168.101.113:4000/api/image";
const char *http_api_key = "";
const int http_send_interval = 1;

#endif