#ifndef NPK_FUNCS_H
#define NPK_FUNCS_H

#include "npk_config.h"

/** Read and send npk readings */
void npk_send_readings()
{
    // Loop through given pins
    for (int i = 0; i < npk_pins_count; i += 3)
    {
        // Store either analog or digital
        int nitrogen = !npk_pins[i] ? 0 : npk_pins[i] >= A0 ? analogRead(npk_pins[i]) : digitalRead(npk_pins[i]);
        int phosphorus = !npk_pins[i+1] ? 0 : npk_pins[i+1] >= A0 ? analogRead(npk_pins[i+1]) : digitalRead(npk_pins[i+1]);
        int potassium = !npk_pins[i+2] ? 0 : npk_pins[i+2] >= A0 ? analogRead(npk_pins[i+2]) : digitalRead(npk_pins[i+2]);

        // Craft the json data
        String json = "\n{\"nitrogen\":\"" + String(nitrogen) + 
            "\",\"phosphorus\":\"" + String(phosphorus) + 
            "\",\"potassium\":\"" + String(potassium) + 
            "\"}\n";

        // Send it
        Serial.print(npk_url + json);
    }
}

/** Continuously sends readings based on interval */
void npk_send_readings_loop()
{
    unsigned long ms = millis();
    unsigned long elapsed = ms - npk_last_read;
    if (elapsed < npk_read_interval)
        return;

    npk_send_readings();
    npk_last_read = ms;
}

#endif