from utime import localtime
from config import config

HOST_ENV = config.get("HOST_ENV", "---")


def log(message):
    # print(localtime())
    year, month, day, hour, minute, second, *rest = localtime()
    ts = f"{year:04d}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}"
    print(f"{ts} - {message}")


def timestamp():
    year, month, day, hour, minute, second, *rest = localtime()
    ts = f"{year:04d}-{month:02d}-{day:02d} {hour:02d}:{minute:02d}:{second:02d}"
    return ts

def utc_timestamp():
    year, month, day, hour, minute, second, *rest = localtime()
    ts = f"{year:04d}-{month:02d}-{day:02d}T{hour:02d}:{minute:02d}:{second:02d}Z"
    return ts


def is_dev():
    return HOST_ENV == "docker"
