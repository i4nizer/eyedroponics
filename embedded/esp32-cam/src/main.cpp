#include "http/http_funcs.h"



/** Initialize pins and connections. */
void setup()
{
  // Logger
  log_init();

  // Camera
  camera_init();

  // WiFi
  wifi_connect();

  // Http
  http_start_task();
}

/** */
void loop()
{
  //
}
