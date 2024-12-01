#ifndef HTTP_CONFIG_H
#define HTTP_CONFIG_H

#include <HTTPClient.h>
#include "../wifi/wifi_funcs.h"

const char *http_endpoint = "http://192.168.101.85:4000/api/image";
const char *http_api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzQ5YzhjYTMxYTNlOWI2ZDBkOWM1YjgiLCJwcm9qZWN0SWQiOiI2NzQ5Y2MyN2M1OTJiZjQ2YWIzMjJlOGEiLCJkZXZpY2VJZCI6IjY3NDljYzNhYzU5MmJmNDZhYjMyMmU5MCIsImlhdCI6MTczMjg4OTY1OH0.m-IFC0wYrCfrcXZzrRqPMWJ_QiP9xRNb7Rj_AS9VjFI";
const int http_send_interval = 1;

#endif