from config import config
from utime import sleep_ms
from device_util import is_dev

try:
    from machine import Pin
except Exception as e:
    if not is_dev():
        print("DEBUG: Failed to import from machine", e)

PIN_STATUS_LED = config.get("PIN_STATUS_LED", 2)


def blink(delay: int = 500):
    try:
        led_pin1 = Pin(PIN_STATUS_LED, Pin.OUT)
        led_pin1.value(1)
        sleep_ms(delay)
        led_pin1.value(0)
    except Exception as e:
        if not is_dev():
            print("DEBUG: Failed to blink led", e)
