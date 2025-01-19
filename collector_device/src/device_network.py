import utime
from config import config
import lib_led
from device_util import is_dev
import gc

try:
    import network
    from ntptime import settime
except Exception as e:
    if not is_dev():
        print("DEBUG: Failed to import from machine")

# Replace the following with your WIFI Credentials
SSID = config.get("SSID")
SSID_PASSWORD = config.get("SSID_PASSWORD")

sta_if = network.WLAN(network.STA_IF)

def do_connect():
    gc.collect()
    print("Connecting to your wifi...")
    global sta_if
    trial = 0
    if not sta_if:
        return
    if not sta_if.isconnected():
        print("connecting to network...")
        sta_if.active(True)
        sta_if.connect(SSID, SSID_PASSWORD)
        while not sta_if.isconnected():
            print("Attempting to connect....")
            utime.sleep(1)
            trial += 1
            if trial > 10:
                print("NOT Connected!")
                return

    if sta_if.isconnected():
        print("Connected! Network config:", sta_if.ifconfig())
        settime()  # set time from internet
        lib_led.blink(1000)
    else:
        print("Not Connected! Network config:", sta_if.ifconfig())
        lib_led.blink(10000)


def reconnect_if_needed():
    global sta_if
    if not sta_if:
        return
    if not sta_if.isconnected():
        do_connect()
