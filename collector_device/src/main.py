import time
from config import config
from utime import sleep_ms, localtime
from device_api import send_data, error_log
import lib_led
import micropython
import device_measure
from machine import deepsleep, wake_reason, reset_cause, DEEPSLEEP_RESET
from device_util import log, is_dev
from device_network import do_connect, reconnect_if_needed


def report_measurement():
    log(f"Measurement cb: {localtime()}")
    ble_devices = device_measure.measure()
    # print("FN:", ble_devices)
    response = send_data(ble_devices)

    if response:
        lib_led.blink(200)
    else:
        lib_led.blink(1000)


def send_to_sleep():
    # Add 10 seconds of nothing in order to be able to send interrupt before going to deepsleep
    print("Waiting before sleep...")
    time.sleep(10)

    # Turn to deepsleep for battery saving
    sleep_minutes = config.get("SLEEP_MINUTE", 15)
    print(f"Go to sleep for {sleep_minutes} minutes...")
    sleep_time = sleep_minutes * 60 * 1000
    deepsleep(sleep_time)


def main():
    if "alloc_emergency_exception_buf" in dir(micropython):
        # allocate space for errors
        micropython.alloc_emergency_exception_buf(100)  

    try:
        do_connect()
    except Exception as e:
        if not is_dev():
            print("DEBUG: Failed to connect to network...", e)
    try:
        reconnect_if_needed()
        report_measurement()
        send_to_sleep()
    except Exception as e:
        print(f"Error during sending data: {e}")


if __name__ == "__main__":
    if config.get("START", False):
        main()
    elif reset_cause() == DEEPSLEEP_RESET:
        print("Start on wakeup!")
        main()
