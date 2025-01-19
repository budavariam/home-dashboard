# Collector Device

## Getting started

- create a thinger.io data bucket
- adjust your temperature monitors to send parsable data, adjust this code if needed
- create and fill the config file `cp src/config.tmpl.py src/config.py`
- prepare the device:
  - get a wifi and BLE capable ESP32 device like D1 mini
  - install micropython to it
  - copy the code to the device
