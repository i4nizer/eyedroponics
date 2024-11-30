#ifndef SOCKET_CONFIG_H
#define SOCKET_CONFIG_H

#include <WebSocketsClient.h>
#include "../wifi/wifi_funcs.h"

// Web Socket Credentials
const char *socket_server = "192.168.101.85";
const int socket_port = 4000;

// Socket Instance
WebSocketsClient socket;

// Configs
const char *socket_api_key = "";
const int socket_reconnect_interval = 5000;


#endif