from config import config
from device_util import log, is_dev, utc_timestamp
from device_api import error_log
import math
import gc
import utime
from random import randint
from machine import Timer

try:
    from bluetooth import BLE
    import lib_bme280
    import dht
    from machine import Pin, SoftI2C
except Exception as e:
    if not is_dev():
        print("DEBUG: Failed to import from machine")
import _thread
from utime import localtime
from binascii import hexlify
from device_mi_parser import parse_bthomev2_data
import collections

_IRQ_SCAN_RESULT = const(5)
_IRQ_SCAN_DONE = const(6)

HOST_ENV = config.get("HOST_ENV", "---")
BLE_SCAN_SEC = config.get("BLE_SCAN_SEC", 30)


class BleCollector(object):
    def __init__(self):
        self.ble_devices = {}
        self.irq_queue = []

    def parse_data(self, curr, addr, msg):
        update_value = parse_bthomev2_data(msg)
        # log(f"DEBUG: {addr}: {update_value} {msg}")
        if update_value:
            update_value["timestamp"] = utc_timestamp()
            update_value.update(curr)
            # log(f"BLE UPDATE: {update_value}")
        return update_value

    def process_queue(self):
        res = {}
        if len(self.irq_queue) == 0:
            return res
        try:
            tmp_data = [(addr, msg) for (addr, msg) in self.irq_queue[::-1]]
            self.irq_queue = []
            og_size = len(tmp_data)

            while len(tmp_data) > 0:
                addr, msg = tmp_data.pop()
                res[addr] = self.parse_data(res.get(addr, {}), addr, msg)
            log(f"Process Queue: {res} from {og_size} items")
        except Exception as e:
            error_log(f"Failed to process bluetooth data {e}")
        return res

    def add_to_queue(self, data):
        # Ensure thread-safe access to the queue
        if len(self.irq_queue) < 100:
            self.irq_queue.append(data)

    def handle_ble_scan(self, ev, data):
        """collect data from bluetooth devices"""
        try:
            if ev == _IRQ_SCAN_RESULT:
                addr = hexlify(data[1], ":").decode()
                if addr in config.get("BLE_ALLOWLIST", []):
                    self.add_to_queue((addr, bytes(data[4])))
            elif ev == _IRQ_SCAN_DONE:
                log("Scan done.")
            else:
                log(f"Unexpected event: {ev}")
        except Exception as e:
            log(f"Unexpected BLE event: {e}")


DATA_AVAILABLE = False

def on_scan_finished():
    print("Scan finished. Found messages:", len(ble_collector.irq_queue))
    global DATA_AVAILABLE
    DATA_AVAILABLE = True


ble_collector = BleCollector()


def start_scan():
    log(f"Start BLE scan for {BLE_SCAN_SEC} seconds")
    USE_BLE = config.get("USE_BLE", True)
    if USE_BLE:
        ble = BLE()
        ble.active(True)
        ble.irq(ble_collector.handle_ble_scan)

        # Start scanning
        ble.gap_scan(BLE_SCAN_SEC * 1_000, 55_000, 25_250)  # Scan for n seconds

        def stop_scan(timer):
            try:
                ble.gap_scan(None)
            except:
                pass
            on_scan_finished()  
            # Notify scan finished

        timer = Timer(-1)  # Use a virtual timer
        timer.init(period=BLE_SCAN_SEC * 1_000, mode=Timer.ONE_SHOT, callback=stop_scan)


def measure():
    gc.collect()
    global ble_collector
    global DATA_AVAILABLE
    ble_devices = {}
    result = []
    has_error = False

    start_scan()

    while not DATA_AVAILABLE:
        utime.sleep_ms(1000)

    try:
        ble_devices = ble_collector.process_queue()
        ble_collector.ble_devices = ble_devices
        for device_address, reading in ble_devices.items():
            # print(f"MEASURE: {device_address}, {reading}")
            if reading:
                data_fields = [
                    "bat",
                    "hum",
                    "tmp",
                    "operating",
                    # "pid", # no relevance
                    "pow",
                ]
                data = {
                    k: reading[k]
                    for k in data_fields
                    if reading.get(k, None) is not None
                }

                result.append(
                    {
                        "n": "".join(device_address.split(":")[3:]).upper(),
                        "r": data,
                        "ts": reading["timestamp"],
                    }
                )

    except Exception as e:
        error_log(f"Failed to read BT values {e}")

    return {"readings": result}
