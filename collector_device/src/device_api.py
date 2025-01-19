# import urequests
import requests
import ujson
import machine
from device_util import log
from config import config

THINGER_USERNAME = config.get("THINGER_USERNAME", "")
THINGER_DEVICE_CREDENTIAL = config.get("THINGER_TOKEN", "")
THINGER_BUCKET = config.get("THINGER_BUCKET", "")

API_URL = f"https://api.thinger.io/v1/users/{THINGER_USERNAME}/buckets/{THINGER_BUCKET}/data"

def send_data(payload):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {THINGER_DEVICE_CREDENTIAL}",
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        if response.status_code == 200:
            log("Data sent successfully!")
        else:
            log(f"Failed to send data. Status code: {response.status_code}")
            log(f"Response: {response.text}")
        response.close()
    except Exception as e:
        log(f"Error while sending data: {e}")

def error_log(message):
    log(message)

