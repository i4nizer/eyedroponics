#ifndef PH_FUNCS_H
#define PH_FUNCS_H

#include "ph_config.h"

/** Read and send pH readings */
void ph_send_readings()
{
    // Loop through given pins
    for (int i = 0; i < ph_pins_count; i++)
    {
        // Store either analog or digital
        float reading = 0;

        // Analog
        if (ph_pins[i] >= A0)
        {
            reading = analogRead(ph_pins[i]);
        }
        // Digital
        else
        {
            reading = digitalRead(ph_pins[i]);
        }

        // Convert to voltage
        const float voltage = reading * (5 / 1023.0);

        // Calculate pH based on voltage
        const float pH = (ph_slope * voltage) + ph_offset;

        // Craft the json data
        String json = "\n{\"ph\":\"" + String(pH) + "\"}\n";

        // Send it
        Serial.print(ph_url + json);
    }
}

/** Continuously sends readings based on interval */
void ph_send_readings_loop()
{
    unsigned long ms = millis();
    unsigned long elapsed = ms - ph_last_read;
    if (elapsed < ph_read_interval) return;

    ph_send_readings();
    ph_last_read = ms;
}

#endif