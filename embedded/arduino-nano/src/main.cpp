#include <Arduino.h>
#include "./npk/npk_funcs.h"







void setup() {
  
  // Init serial
  Serial.begin(115200);
  
  // Init pH pins
  for (int i = 0; i < ph_pins_count; i++)
  {
    pinMode(ph_pins[i], INPUT);
  }

  // Init NPK pins
  for (int i = 0; i < npk_pins_count; i++)
  {
    pinMode(npk_pins[i], INPUT);
  }
  
}

void loop() {
  ph_send_readings_loop();
  npk_send_readings_loop();
}