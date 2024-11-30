#ifndef LOGGER_FUNCS_H
#define LOGGER_FUNCS_H

#include <Arduino.h>

/** Just serial initialization. */
void log_init()
{
    Serial.begin(115200);
}

/** [INFO] [TAG] Message Here. */
void log_info(const char *tag, const char *msg)
{
    Serial.print("[INFO]    ");
    Serial.print("[");
    Serial.print(tag);
    Serial.print("] ");
    Serial.println(msg);
}

/** [SUCCESS] [TAG] Message Here. */
void log_success(const char *tag, const char *msg)
{
    Serial.print("[SUCCESS] ");
    Serial.print("[");
    Serial.print(tag);
    Serial.print("] ");
    Serial.println(msg);
}

/** [WARNING] [TAG] Message Here. */
void log_warn(const char *tag, const char *msg)
{
    Serial.print("[WARN]    ");
    Serial.print("[");
    Serial.print(tag);
    Serial.print("] ");
    Serial.println(msg);
}

/** [ERROR] [TAG] Message Here. */
void log_error(const char *tag, const char *msg)
{
    Serial.print("[ERROR]   ");
    Serial.print("[");
    Serial.print(tag);
    Serial.print("] ");
    Serial.println(msg);
}

#endif