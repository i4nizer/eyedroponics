#ifndef PH_CONFIG_H
#define PH_CONFIG_H

#include <Arduino.h>

/** API endpoint */
const char *ph_url = "http://192.168.193.120:4000/api/ph";

/** For reading without blocking */
const int ph_read_interval = 1000;
unsigned long ph_last_read = 0;

/** Pins & size*/
const int ph_pins[] = {A0};
const size_t ph_pins_size = sizeof(ph_pins[0]);
const int ph_pins_count = (ph_pins_size > 0) ? (sizeof(ph_pins) / ph_pins_size) : 0;

/** For calibration & calculation */
const float ph_vref = 5.0;
const float ph_slope = -5.0;
const float ph_offset = 27.05;

#endif