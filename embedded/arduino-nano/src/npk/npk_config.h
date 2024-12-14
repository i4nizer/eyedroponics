#ifndef NPK_CONFIG_H
#define NPK_CONFIG_H

#include "../ph/ph_funcs.h"

/** Init NPK url, reading, and pins */
const char *npk_url = "http://192.168.193.120:4000/api/npk";
const int npk_read_interval = 1000;
unsigned long npk_last_read = 0;

const int npk_pins[] = { A1, A2, A3, };
const size_t npk_pins_size = sizeof(npk_pins[0]);
const int npk_pins_count = (npk_pins_size > 0) ? (sizeof(npk_pins) / npk_pins_size) : 0;

#endif